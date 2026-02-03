import { listStocks, createStock, updateStock, deleteStock } from './routes/stocks.js';
import { listIndustries, createIndustry, updateIndustry, deleteIndustry } from './routes/industries.js';
import { screenHoldings } from './routes/screen.js';
import { aiInvoke } from './routes/ai.js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Content-Type': 'application/json',
};

const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: CORS_HEADERS,
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  try {
    const { path = '', httpMethod } = event;
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
    if (path === '/ai/invoke' && httpMethod === 'POST') return await aiInvoke(event);

    if (httpMethod === 'OPTIONS') return jsonResponse(200, {});

    return jsonResponse(404, { message: 'Not Found' });
  } catch (err) {
    console.error(err);
    return jsonResponse(500, { message: err.message || 'Server error' });
  }
};
