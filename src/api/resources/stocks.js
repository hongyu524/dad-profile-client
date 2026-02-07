import { apiClient } from '@/lib/apiClient';
import { cleanStr, cleanNum, normalizeIndustry } from '@/lib/normalize';

const resourcePath = '/stocks';

function decodeWeirdQuotedString(v) {
  if (v == null) return "";
  if (typeof v !== "string") return v;

  const s = v.trim();

  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    try {
      const parsed = JSON.parse(s);
      if (typeof parsed === "string") return parsed.trim();
      return parsed;
    } catch (_) {}
  }

  return s.replace(/^"+|"+$/g, "").replace(/^'+|'+$/g, "").trim();
}

function toNumber(v) {
  if (v == null || v === "") return 0;
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;

  const s = decodeWeirdQuotedString(v)
    .replace(/,/g, "")
    .replace(/\s+/g, "");

  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

function normalizeItem(it) {
  if (!it || typeof it !== "object") return it;
  const industryLevel1 = normalizeIndustry(it.industry_level1 ?? it.industryLevel1 ?? it.industry1 ?? it.industry_74);
  const industryLevel2 = normalizeIndustry(it.industry_level2 ?? it.industryLevel2 ?? it.industry2);
  const industryLevel3 = normalizeIndustry(it.industry_level3 ?? it.industryLevel3 ?? it.industry3);

  const totalShares = cleanNum(it.totalShares ?? it.total_shares ?? it.total_capital ?? it.total_cap ?? it["总股本"]);
  const floatShares = cleanNum(it.floatShares ?? it.float_shares ?? it.float_capital ?? it.float_cap ?? it["流通股本"]);
  const price = cleanNum(it.price);

  return {
    ...it,
    // ensure stable id for selection; fall back to code
    id: cleanStr(it.id ?? it.code),
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
    price,
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
    const cleaned = items.map((it) => ({
      ...it,

      code: decodeWeirdQuotedString(it.code),
      name: decodeWeirdQuotedString(it.name ?? it.stockName ?? it.title),
      product: decodeWeirdQuotedString(it.product),

      industry_level1: normalizeIndustry(it.industry_level1),
      industry_level2: normalizeIndustry(it.industry_level2),
      industry_level3: normalizeIndustry(it.industry_level3),

      total_cap: toNumber(it.total_cap),
      float_cap: toNumber(it.float_cap),
      totalShares: toNumber(it.totalShares ?? it.total_shares ?? it.total_capital ?? it.total_cap ?? it['总股本']),
      floatShares: toNumber(it.floatShares ?? it.float_shares ?? it.float_capital ?? it.float_cap ?? it.circulating_shares ?? it['流通股本']),
      circulating_shares: toNumber(it.floatShares ?? it.float_shares ?? it.circulating_shares ?? it.float_capital ?? it.float_cap ?? it['流通股本']),
      price: toNumber(it.price),
    }));
    console.info("[stocks] items length:", cleaned.length);
    return cleaned;
  },
  create: (data) => apiClient.post(resourcePath, data),
  update: (id, data) => apiClient.put(`${resourcePath}/${id}`, data),
  remove: (id) => apiClient.del(`${resourcePath}/${id}`),
};
