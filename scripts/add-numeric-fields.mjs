import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const REGION = process.env.AWS_REGION || "us-west-2";
const TABLE_NAME = process.env.TABLE_NAME || "AppData";
const YEAR = process.env.YEAR; // optional, if set will only update PK = STOCKS#<YEAR>
const CSV_PATH = process.env.CSV_PATH || "./Stock_export.csv";
const DEFAULT_TOTAL = Number(process.env.DEFAULT_TOTAL || 0);
const DEFAULT_FLOAT = Number(process.env.DEFAULT_FLOAT || 0);
const DEFAULT_PRICE = Number(process.env.DEFAULT_PRICE || 0);

if (!TABLE_NAME) {
  throw new Error("TABLE_NAME is required");
}

const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }));

// Load CSV mapping once (code + year -> totals)
let csvMap = null;
function loadCsvMap() {
  if (!fs.existsSync(CSV_PATH)) {
    console.warn(`CSV not found at ${path.resolve(CSV_PATH)}; skipping CSV-based backfill.`);
    return;
  }
  const rows = parse(fs.readFileSync(CSV_PATH, "utf8"), { columns: true, skip_empty_lines: true });
  csvMap = new Map();
  for (const r of rows) {
    const year = Number(r.year) || YEAR || 2026;
    const code = String(r.code ?? "").trim();
    if (!code) continue;
    const key = `${year}|${code}`;
    csvMap.set(key, {
      total: r.total_shares,
      float: r.circulating_shares,
      price: r.price,
    });
  }
  console.log(`Loaded ${csvMap.size} rows from CSV for backfill.`);
}

function toNumber(val, fallback) {
  if (val === undefined || val === null || val === "") return fallback;
  if (typeof val === "number") return Number.isFinite(val) ? val : fallback;
  const s = String(val).replace(/,/g, "").trim().replace(/^"+|"+$/g, "");
  const n = Number(s);
  return Number.isFinite(n) ? n : fallback;
}

async function scanAll() {
  const items = [];
  let lastKey;
  do {
    const params = {
      TableName: TABLE_NAME,
      ExclusiveStartKey: lastKey,
    };
    if (YEAR) {
      params.FilterExpression = "begins_with(PK, :pk)";
      params.ExpressionAttributeValues = { ":pk": `STOCKS#${YEAR}` };
    }
    const res = await client.send(new ScanCommand(params));
    items.push(...(res.Items || []));
    lastKey = res.LastEvaluatedKey;
    console.log(`Scanned ${items.length} items so far...`);
  } while (lastKey);
  return items;
}

async function updateItem(item) {
  const fromCsv =
    csvMap &&
    (item.code
      ? csvMap.get(`${item.year || YEAR || 2026}|${String(item.code).replace(/"/g, "")}`)
      : null);

  const totalShares = toNumber(
    item.totalShares ??
      item.total_shares ??
      item.total_cap ??
      item.total_capital ??
      item["总股本"] ??
      fromCsv?.total,
    DEFAULT_TOTAL
  );
  const floatShares = toNumber(
    item.floatShares ??
      item.float_shares ??
      item.float_cap ??
      item.float_capital ??
      item["流通股本"] ??
      fromCsv?.float,
    DEFAULT_FLOAT
  );
  const price = toNumber(item.price ?? fromCsv?.price, DEFAULT_PRICE);

  const updates = [];
  const names = {};
  const values = {};

  const maybeSet = (attr, value) => {
    const current = item[attr];
    if (typeof current === "number" && current === value) return;
    if (current !== undefined && typeof current !== "number") {
      // replace string with number
      updates.push(`#${attr} = :${attr}`);
      names[`#${attr}`] = attr;
      values[`:${attr}`] = value;
      return;
    }
    if (current === undefined || current === null) {
      updates.push(`#${attr} = :${attr}`);
      names[`#${attr}`] = attr;
      values[`:${attr}`] = value;
    }
  };

  maybeSet("totalShares", totalShares);
  maybeSet("floatShares", floatShares);
  maybeSet("price", price);

  if (!updates.length) return false;

  await client.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { PK: item.PK, SK: item.SK },
      UpdateExpression: "SET " + updates.join(", "),
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    })
  );
  return true;
}

async function main() {
  loadCsvMap();
  console.log(`Scanning ${TABLE_NAME} in ${REGION}${YEAR ? " for year " + YEAR : ""}...`);
  const items = await scanAll();
  let updated = 0;
  for (const it of items) {
    const changed = await updateItem(it);
    if (changed) updated++;
  }
  console.log(`Done. Items scanned: ${items.length}. Items updated: ${updated}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
