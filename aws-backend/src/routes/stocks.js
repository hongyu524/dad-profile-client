import { ddbPut, ddbDelete, ddbQuery } from '../lib/ddb.js';

const encodeToken = (lek) => Buffer.from(JSON.stringify(lek)).toString('base64');
const decodeToken = (token) => JSON.parse(Buffer.from(token, 'base64').toString('utf8'));

const buildItem = (body) => {
  const code = body.code || body.id; // keep compatibility if UI sends id
  const year = body.year || new Date().getFullYear();
  if (!code) throw new Error('code is required');

  return {
    PK: `STOCKS#${year}`,
    SK: `CODE#${code}`,
    entityType: 'stock',
    code,
    id: code,
    year,
    ...body,
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

  console.log('stocks.list', {
    method: event?.httpMethod,
    path: event?.path,
    year,
    count: items.length,
    nextToken: !!nextToken,
    ms: Date.now() - start,
  });

  return { items, nextToken };
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
