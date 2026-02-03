import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import fetch from 'node-fetch';

const {
  TABLE_NAME,
  AWS_REGION = 'us-west-2',
  BASE44_URL,
  BASE44_APP_ID,
  BASE44_TOKEN,
  BASE44_ENTITY = 'Stock',
} = process.env;

if (!TABLE_NAME || !BASE44_URL || !BASE44_APP_ID || !BASE44_TOKEN) {
  console.error('Missing env vars. Required: TABLE_NAME, BASE44_URL, BASE44_APP_ID, BASE44_TOKEN');
  process.exit(1);
}

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: AWS_REGION }));

async function listStocks() {
  // Base44 entity endpoint pattern:
  //   <BASE44_URL>/api/apps/<APP_ID>/entities/<ENTITY>
  const url = `${BASE44_URL}/api/apps/${BASE44_APP_ID}/entities/${BASE44_ENTITY}?api_key=${encodeURIComponent(
    BASE44_TOKEN
  )}`;
  console.log(`Fetching: ${url}`);
  const res = await fetch(url, {
    headers: {
      // Base44 accepts api_key; include app id and bearer for private apps
      'api_key': BASE44_TOKEN,
      'Authorization': `Bearer ${BASE44_TOKEN}`,
      'X-App-Id': BASE44_APP_ID,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Base44 list failed ${res.status}: ${text}`);
  }
  return res.json();
}

async function upsertStock(stock) {
  const year = stock.year || new Date().getFullYear();
  const pk = `STOCK#${stock.id || stock.code || crypto.randomUUID()}`;
  const sk = `META#${year}`;
  const item = { PK: pk, SK: sk, ...stock, year };
  await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
}

async function main() {
  const stocks = await listStocks();
  console.log(`Fetched ${stocks.length} stocks from Base44`);
  let ok = 0;
  for (const s of stocks) {
    await upsertStock(s);
    ok++;
    if (ok % 50 === 0) console.log(`Upserted ${ok}/${stocks.length}`);
  }
  console.log(`Done. Upserted ${ok} stocks into ${TABLE_NAME}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
