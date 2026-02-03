import { apiClient } from '@/lib/apiClient';
import { cleanStr, cleanNum } from '@/lib/normalize';

const resourcePath = '/stocks';

function normalizeItem(it) {
  if (!it || typeof it !== "object") return it;
  const industryLevel1 = cleanStr(it.industry_level1 ?? it.industryLevel1 ?? it.industry1 ?? it.industry_74);
  const industryLevel2 = cleanStr(it.industry_level2 ?? it.industryLevel2 ?? it.industry2);
  const industryLevel3 = cleanStr(it.industry_level3 ?? it.industryLevel3 ?? it.industry3);

  const totalShares = cleanNum(it.totalShares ?? it.total_shares ?? it.total_capital ?? it.total_cap ?? it["总股本"]);
  const floatShares = cleanNum(it.floatShares ?? it.float_shares ?? it.float_capital ?? it.float_cap ?? it["流通股本"]);

  return {
    ...it,
    code: cleanStr(it.code),
    name: cleanStr(it.name ?? it.stockName ?? it.title),
    product: cleanStr(it.product),
    entityType: cleanStr(it.entityType),
    industry_level1: industryLevel1,
    industry_level2: industryLevel2,
    industry_level3: industryLevel3,
    industry_74: cleanStr(it.industry_74 ?? industryLevel1), // keep legacy key used by UI
    totalShares,
    floatShares,
    total_shares: totalShares, // keep legacy naming used by UI
    circulating_shares: floatShares,
  };
}

export const stocksApi = {
  list: async (year) => {
    const data = await apiClient.get(year ? `${resourcePath}?year=${encodeURIComponent(year)}` : resourcePath);
    console.info("[stocks] RAW API RESPONSE", data);
    const raw = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []);
    const items = raw.map(normalizeItem);
    console.info("[stocks] items length:", items.length);
    return items;
  },
  create: (data) => apiClient.post(resourcePath, data),
  update: (id, data) => apiClient.put(`${resourcePath}/${id}`, data),
  remove: (id) => apiClient.del(`${resourcePath}/${id}`),
};
