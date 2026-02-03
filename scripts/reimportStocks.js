"use strict";

// One-time reimport: load Stock_export.csv and write stocks to DynamoDB
// PK = STOCKS#<year>
// SK = CODE#<code>
// Overwrites existing items (PutItem).

import fs from "fs";
import path from "path";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const REGION = process.env.AWS_REGION || "us-west-2";
const TABLE_NAME = process.env.TABLE_NAME;
const CSV_PATH = process.env.CSV_PATH || "./Stock_export.csv";
const YEAR = Number(process.env.YEAR || 2026);

if (!TABLE_NAME) {
  throw new Error("TABLE_NAME is required");
}
if (!YEAR) {
  throw new Error("YEAR is required/valid (e.g., 2026)");
}

const ddb = new DynamoDBClient({ region: REGION });

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const header = lines[0].split(",").map((s) => s.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(",");
    const obj = {};
    header.forEach((h, idx) => (obj[h] = cells[idx] ?? ""));
    rows.push(obj);
  }
  return rows;
}

function toItem(row) {
  const code = String(row.code ?? "").trim();
  if (!code) return null;
  return {
    PK: { S: `STOCKS#${YEAR}` },
    SK: { S: `CODE#${code}` },
    entityType: { S: "stock" },
    year: { N: String(YEAR) },
    code: { S: code },
    name: row.name ? { S: String(row.name).trim() } : undefined,
    industry_74: row.industry_74 ? { S: String(row.industry_74).trim() } : undefined,
    industry_level2: row.industry_level2 ? { S: String(row.industry_level2).trim() } : undefined,
    industry_level3: row.industry_level3 ? { S: String(row.industry_level3).trim() } : undefined,
    product: row.product ? { S: String(row.product).trim() } : undefined,
    updatedAt: { S: new Date().toISOString() },
  };
}

async function main() {
  const resolved = path.resolve(CSV_PATH);
  if (!fs.existsSync(resolved)) {
    throw new Error(`CSV not found at ${resolved}`);
  }
  const csvText = fs.readFileSync(resolved, "utf8");
  const rows = parseCSV(csvText);
  console.log(`Found ${rows.length} CSV rows`);

  let written = 0;
  for (const row of rows) {
    const item = toItem(row);
    if (!item) continue;
    await ddb.send(new PutItemCommand({ TableName: TABLE_NAME, Item: item }));
    console.log(`Imported code=${item.code.S}`);
    written++;
  }

  console.log(`Done. Total imported: ${written}. Year=${YEAR}. Table=${TABLE_NAME}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
