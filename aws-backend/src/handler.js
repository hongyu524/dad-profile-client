import { listStocks, createStock, updateStock, deleteStock } from './routes/stocks.js';
import { listIndustries, createIndustry, updateIndustry, deleteIndustry } from './routes/industries.js';
import { screenHoldings } from './routes/screen.js';
import { aiInvoke } from './routes/ai.js';

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://zhoutianming.store';
const RESPONSE_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'content-type, authorization, x-api-key, x-family-code',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: RESPONSE_HEADERS,
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  try {
    const path = event?.rawPath || event?.path || '';
    const httpMethod = event?.requestContext?.http?.method || event?.httpMethod;
    console.log('request', { path, httpMethod });
    if (path === '/health' && httpMethod === 'GET') return jsonResponse(200, { ok: true });
    // stocks
    if (path === '/stocks' && httpMethod === 'GET') return jsonResponse(200, await listStocks(event));
    if (path === '/stocks' && httpMethod === 'POST') return jsonResponse(200, await createStock(event));
    if (path?.startsWith('/stocks/') && httpMethod === 'PUT') return jsonResponse(200, await updateStock(event));
    if (path?.startsWith('/stocks/') && httpMethod === 'DELETE') return jsonResponse(200, await deleteStock(event));

    // industries
    if (path === '/industries' && httpMethod === 'GET') return jsonResponse(200, await listIndustries(event));
    if (path === '/industries' && httpMethod === 'POST') return jsonResponse(200, await createIndustry(event));
    if (path?.startsWith('/industries/') && httpMethod === 'PUT') return jsonResponse(200, await updateIndustry(event));
    if (path?.startsWith('/industries/') && httpMethod === 'DELETE') return jsonResponse(200, await deleteIndustry(event));

    // screening
    if (path === '/screen/holdings' && httpMethod === 'POST') return jsonResponse(200, await screenHoldings(event));

    // AI
    if (path === '/ai/invoke' && httpMethod === 'POST') return await aiInvoke(event, RESPONSE_HEADERS);

    if (httpMethod === 'OPTIONS') return jsonResponse(200, {});

    return jsonResponse(404, { message: 'Not Found' });
  } catch (err) {
    console.error(err);
    return jsonResponse(500, { message: err.message || 'Server error' });
  }
};
