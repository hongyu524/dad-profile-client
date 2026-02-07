import { ddbPut, ddbDelete, ddbQuery } from '../lib/ddb.js';

const encodeToken = (lek) => Buffer.from(JSON.stringify(lek)).toString('base64');
const decodeToken = (token) => JSON.parse(Buffer.from(token, 'base64').toString('utf8'));

const toNum = (v) => {
  if (v === undefined || v === null || v === '') return 0;
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
  const n = Number(String(v).replace(/,/g, '').trim());
  return Number.isFinite(n) ? n : 0;
};

const buildItem = (body) => {
  const code = body.code || body.id; // keep compatibility if UI sends id
  const year = body.year || new Date().getFullYear();
  if (!code) throw new Error('code is required');

  const totalShares = toNum(body.totalShares ?? body.total_shares ?? body.total_cap ?? body.total_capital);
  const floatShares = toNum(body.floatShares ?? body.float_shares ?? body.float_cap ?? body.float_capital ?? body.circulating_shares ?? body['流通股本']);
  const price = toNum(body.price);

  return {
    PK: `STOCKS#${year}`,
    SK: `CODE#${code}`,
    entityType: 'stock',
    code,
    id: code,
    year,
    ...body,
    totalShares,
    total_shares: totalShares,
    floatShares,
    circulating_shares: floatShares,
    price,
  };
};

export const listStocks = async (event) => {
  const params = event?.queryStringParameters || {};
  const year = params.year ? String(params.year) : String(new Date().getFullYear());
  const start = Date.now();

  const queryParams = {
    KeyConditionExpression: 'PK = :pk',
    ExpressionAttributeValues: { ':pk': `STOCKS#${year}` },
  };

  if (params.nextToken) {
    try {
      queryParams.ExclusiveStartKey = decodeToken(params.nextToken);
    } catch (err) {
      console.warn('invalid nextToken ignored');
    }
  }

  const res = await ddbQuery(queryParams);
  const items = res.Items || [];
  const nextToken = res.LastEvaluatedKey ? encodeToken(res.LastEvaluatedKey) : null;

  // Normalize numeric fields server-side so clients get consistent numbers
  const normalizeNumber = (v) => {
    if (v === undefined || v === null || v === '') return 0;
    if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
    const n = Number(String(v).replace(/,/g, '').trim());
    return Number.isFinite(n) ? n : 0;
  };

  const normalizedItems = items.map((it) => {
    const totalShares = normalizeNumber(it.totalShares ?? it.total_shares ?? it.total_cap ?? it.total_capital);
    const floatShares = normalizeNumber(it.floatShares ?? it.float_shares ?? it.float_cap ?? it.float_capital ?? it.circulating_shares ?? it['流通股本']);
    const price = normalizeNumber(it.price);
    return {
      ...it,
      totalShares,
      total_shares: totalShares,
      floatShares,
      circulating_shares: floatShares,
      price,
    };
  });

  console.log('stocks.list', {
    method: event?.httpMethod,
    path: event?.path,
    year,
    count: normalizedItems.length,
    nextToken: !!nextToken,
    ms: Date.now() - start,
  });

  return { items: normalizedItems, nextToken };
};

export const createStock = async (event) => {
  const body = JSON.parse(event.body || '{}');
  const item = buildItem(body);
  await ddbPut({ Item: item });
  return item;
};

export const updateStock = async (event) => {
  const { id } = event.pathParameters || {};
  const body = JSON.parse(event.body || '{}');
  if (!body.year) throw new Error('year is required to update stock');
  const code = body.code || id;
  const year = body.year;
  const item = buildItem({ ...body, code, year });
  await ddbPut({ Item: item });
  return item;
};

export const deleteStock = async (event) => {
  const { id } = event.pathParameters || {};
  const body = JSON.parse(event.body || '{}');
  const code = body.code || id;
  if (!body.year) {
    throw new Error('year is required to delete stock');
  }
  const year = body.year;
  await ddbDelete({ Key: { PK: `STOCKS#${year}`, SK: `CODE#${code}` } });
  return { ok: true };
};
