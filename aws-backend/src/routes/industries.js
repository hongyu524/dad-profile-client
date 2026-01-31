import crypto from 'crypto';
import { ddbPut, ddbScan, ddbDelete } from '../lib/ddb.js';

const buildItem = (body) => {
  const id = body.id || crypto.randomUUID();
  return {
    PK: `INDUSTRY#${id}`,
    SK: 'META',
    id,
    ...body,
  };
};

export const listIndustries = async () => {
  const res = await ddbScan({});
  const items = (res.Items || []).filter((i) => i.PK?.startsWith('INDUSTRY#'));
  return items;
};

export const createIndustry = async (event) => {
  const body = JSON.parse(event.body || '{}');
  const item = buildItem(body);
  await ddbPut({ Item: item });
  return item;
};

export const updateIndustry = async (event) => {
  const { id } = event.pathParameters || {};
  const body = JSON.parse(event.body || '{}');
  const item = { PK: `INDUSTRY#${id}`, SK: 'META', id, ...body };
  await ddbPut({ Item: item });
  return item;
};

export const deleteIndustry = async (event) => {
  const { id } = event.pathParameters || {};
  await ddbDelete({ Key: { PK: `INDUSTRY#${id}`, SK: 'META' } });
  return { ok: true };
};
