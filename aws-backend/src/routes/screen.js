import { listStocks } from './stocks.js';

export const screenHoldings = async (event) => {
  const body = JSON.parse(event.body || '{}');
  const { year, filters = [] } = body;
  // reuse listStocks for base set
  const stocks = await listStocks({ queryStringParameters: { year } });
  let result = stocks;
  filters.forEach((f) => {
    const { field, operator = 'gte', value = 0 } = f;
    result = result.filter((s) => {
      const v = Number(s[field] || 0);
      if (operator === 'gte') return v >= value;
      if (operator === 'lte') return v <= value;
      return true;
    });
  });
  return result;
};
