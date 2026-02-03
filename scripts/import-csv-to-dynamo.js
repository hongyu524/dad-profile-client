import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import crypto from 'crypto';

const {
  TABLE_NAME,
  AWS_REGION = 'us-west-2',
} = process.env;

if (!TABLE_NAME) {
  console.error('Missing env TABLE_NAME');
  process.exit(1);
}

const args = process.argv.slice(2);
const getArg = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};

const stockPath = getArg('--stock');
const profilePath = getArg('--profile');
const analysisPath = getArg('--analysis');

if (!stockPath && !profilePath && !analysisPath) {
  console.error('Usage: node scripts/import-csv-to-dynamo.js --stock <Stock.csv> --profile <Company_Profile.csv> --analysis <AI_Analysis.csv>');
  process.exit(1);
}

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: AWS_REGION }));

const loadCsv = (path) => parse(fs.readFileSync(path, 'utf8'), { columns: true, skip_empty_lines: true });

const putItem = async (item) => {
  await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
};

const importStocks = async () => {
  if (!stockPath) return;
  const rows = loadCsv(stockPath);
  let ok = 0;
  for (const r of rows) {
    const id = r.id || r.stock_id || r.code || crypto.randomUUID();
    const year = Number(r.year) || 2026;
    const item = {
      PK: `STOCK#${id}`,
      SK: `META#${year}`,
      ...r,
      id,
      year,
    };
    await putItem(item);
    ok++;
  }
  console.log(`Imported stocks: ${ok}`);
};

const importProfiles = async () => {
  if (!profilePath) return;
  const rows = loadCsv(profilePath);
  let ok = 0;
  for (const r of rows) {
    const stockId = r.stock_id || r.id || crypto.randomUUID();
    const pid = r.id || crypto.randomUUID();
    const item = {
      PK: `STOCK#${stockId}`,
      SK: `AI#PROFILE#${pid}`,
      ...r,
      id: pid,
      stock_id: stockId,
    };
    await putItem(item);
    ok++;
  }
  console.log(`Imported profiles: ${ok}`);
};

const importAnalyses = async () => {
  if (!analysisPath) return;
  const rows = loadCsv(analysisPath);
  let ok = 0;
  for (const r of rows) {
    const stockId = r.stock_id || r.id || crypto.randomUUID();
    const aid = r.id || crypto.randomUUID();
    const item = {
      PK: `STOCK#${stockId}`,
      SK: `AI#ANALYSIS#${aid}`,
      ...r,
      id: aid,
      stock_id: stockId,
    };
    await putItem(item);
    ok++;
  }
  console.log(`Imported analyses: ${ok}`);
};

const main = async () => {
  await importStocks();
  await importProfiles();
  await importAnalyses();
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
