import crypto from 'crypto';
import { ddbPut, ddbScan, ddbDelete } from '../lib/ddb.js';

const table = process.env.TABLE_NAME;

const buildItem = (body) => {
  const id = body.id || crypto.randomUUID();
  const year = body.year || new Date().getFullYear();
  return {
    PK: `STOCK#${id}`,
    SK: `META#${year}`,
    ...body,
    id,
    year
  };
};

export const listStocks = async (event) => {
  const params = event?.queryStringParameters || {};
  const targetYear = params.year || new Date().getFullYear();
  if (!params.year) console.warn('GET /stocks without year; defaulting to current year');
  // MVP scan + filter in Lambda (filter early by year)
  const res = await ddbScan({});
  const items = (res.Items || []).filter((i) => i.PK?.startsWith('STOCK#'));
  let filtered = items.filter((s) => String(s.year) === String(targetYear));
  if (params.industry) filtered = filtered.filter((s) => s.industry_74 === params.industry);
  if (params.keyword) {
    const kw = params.keyword.toLowerCase();
    filtered = filtered.filter((s) =>
      s.name?.toLowerCase().includes(kw) ||
      s.code?.toLowerCase().includes(kw) ||
      s.industry_74?.toLowerCase().includes(kw)
    );
  }
  return filtered;
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
  if (!body.year) {
    throw new Error('year is required to update stock');
  }
  const year = body.year;
  const item = { PK: `STOCK#${id}`, SK: `META#${year}`, ...body, id, year };
  await ddbPut({ Item: item });
  return item;
};

export const deleteStock = async (event) => {
  const { id } = event.pathParameters || {};
  const body = JSON.parse(event.body || '{}');
  if (!body.year) {
    throw new Error('year is required to delete stock');
  }
  const year = body.year;
  await ddbDelete({ Key: { PK: `STOCK#${id}`, SK: `META#${year}` } });
  return { ok: true };
};
