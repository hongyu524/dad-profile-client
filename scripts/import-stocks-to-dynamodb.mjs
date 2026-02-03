"use strict";

// One-time importer: Stock_export.csv -> DynamoDB table AppData (PK/SK design)
// PK: STOCKS#<year>
// SK: CODE#<code>

import fs from "fs";
import path from "path";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";

// ---------- CONFIG ----------
const REGION = process.env.AWS_REGION || "us-west-2";
const TABLE_NAME = process.env.TABLE_NAME || "AppData";
const CSV_PATH = process.env.CSV_PATH || "./Stock_export.csv";
const AWS_PROFILE = process.env.AWS_PROFILE;

// Optional: only import one year
const ONLY_YEAR = process.env.ONLY_YEAR ? Number(process.env.ONLY_YEAR) : null;

// ---------- DynamoDB ----------
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }), {
  marshallOptions: { removeUndefinedValues: true },
});
const sts = new STSClient({ region: REGION });

async function ensureIdentity() {
  if (!AWS_PROFILE) {
    throw new Error("AWS_PROFILE is required (expected stocks-app-importer)");
  }
  const ident = await sts.send(new GetCallerIdentityCommand({}));
  const arn = ident.Arn || "";
  if (!arn.includes("user/stocks-app-importer")) {
    throw new Error(`Wrong AWS identity. Expected stocks-app-importer, got ${arn}`);
  }
  return arn;
}

// ---------- CSV PARSER (simple, works for your file if no crazy quoted commas) ----------
function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = lines[0].split(",").map((s) => s.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    // Minimal CSV parse that respects quotes
    const cells = [];
    let cur = "";
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const ch = line[j];
      if (ch === '"' && line[j + 1] === '"') {
        cur += '"';
        j++;
        continue;
      }
      if (ch === '"') {
        inQuotes = !inQuotes;
        continue;
      }
      if (ch === "," && !inQuotes) {
        cells.push(cur);
        cur = "";
        continue;
      }
      cur += ch;
    }
    cells.push(cur);

    const obj = {};
    header.forEach((h, idx) => {
      obj[h] = cells[idx] ?? "";
    });
    rows.push(obj);
  }

  return rows;
}

function toNumberMaybe(v) {
  if (v === null || v === undefined) return undefined;
  const s = String(v).trim();
  if (s === "" || s.toLowerCase() === "nan") return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : s;
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function batchWriteAll(items) {
  const batches = chunk(items, 25);

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];

    let requestItems = {
      [TABLE_NAME]: batch.map((Item) => ({
        PutRequest: { Item },
      })),
    };

    // Retry unprocessed items
    for (let attempt = 1; attempt <= 8; attempt++) {
      const res = await ddb.send(new BatchWriteCommand({ RequestItems: requestItems }));
      const unprocessed = res.UnprocessedItems?.[TABLE_NAME] || [];
      if (!unprocessed.length) break;

      requestItems = { [TABLE_NAME]: unprocessed };

      const backoff = Math.min(2000, 50 * Math.pow(2, attempt));
      await new Promise((r) => setTimeout(r, backoff));
      if (attempt === 8) {
        throw new Error(`Batch ${i + 1}/${batches.length} still has unprocessed items after retries.`);
      }
    }

    if ((i + 1) % 10 === 0 || i === batches.length - 1) {
      console.log(`✅ Imported batch ${i + 1}/${batches.length}`);
    }
  }
}

async function main() {
  await ensureIdentity();

  console.log(`cwd: ${process.cwd()}`);
  const resolvedCsvPath = path.resolve(CSV_PATH);
  console.log(`CSV path: ${resolvedCsvPath}`);
  if (!fs.existsSync(resolvedCsvPath)) {
    throw new Error(`CSV not found. Expected at ${resolvedCsvPath}. Place Stock_export.csv in project root or set CSV_PATH explicitly.`);
  }

  const csvText = fs.readFileSync(resolvedCsvPath, "utf8");
  const rows = parseCSV(csvText);

  console.log(`Found ${rows.length} CSV rows`);

  const items = [];
  for (const r of rows) {
    const year = Number(r.year);
    const code = String(r.code ?? "").trim();

    if (!year || !code) continue;
    if (ONLY_YEAR && year !== ONLY_YEAR) continue;

    // Build DynamoDB item
    const item = {
      PK: `STOCKS#${year}`,
      SK: `CODE#${code}`,
      entityType: "stock",
      year,
      code,

      // Keep original fields (convert numeric-like strings)
      name: r.name?.trim() || undefined,
      industry_74: r.industry_74?.trim() || undefined,
      industry_level2: r.industry_level2?.trim() || undefined,
      industry_level3: r.industry_level3?.trim() || undefined,
      product: r.product?.trim() || undefined,

      // Store everything else too (optional)
      raw: Object.fromEntries(Object.entries(r).map(([k, v]) => [k, toNumberMaybe(v)])),

      updatedAt: new Date().toISOString(),
    };

    items.push(item);
  }

  // --- De-dupe items by PK+SK (BatchWriteItem rejects duplicates in same request) ---
  const keyOf = (it) => `${it.PK}|${it.SK}`;
  const map = new Map();
  let dupes = 0;
  for (const it of items) {
    const k = keyOf(it);
    if (map.has(k)) dupes++;
    // keep last occurrence
    map.set(k, it);
  }
  const dedupedItems = Array.from(map.values());

  const years = [...new Set(dedupedItems.map((i) => i.year))].sort();
  console.log(`De-dupe: dropped ${dupes} duplicate rows (same PK+SK).`);
  console.log(`Will write ${dedupedItems.length} unique items.`);
  console.log(`Prepared ${dedupedItems.length} items to write to ${TABLE_NAME} in ${REGION}`);
  console.log(`Years: ${years.join(", ")}`);
  await batchWriteAll(dedupedItems);

  console.log(`Imported ${rows.length} rows`);
  console.log(`Total items written: ${dedupedItems.length}`);
  console.log(`Years: ${years.join(", ")}`);
  console.log("DynamoDB writes complete");
  console.log("🎉 Done.");
}

main().catch((err) => {
  console.error("IMPORT FAILED:", err);
  process.exit(1);
});
