import crypto from 'crypto';

export const stableStringify = (obj) => {
  if (obj === null || obj === undefined) return '';
  if (typeof obj !== 'object') return String(obj);
  if (Array.isArray(obj)) return `[${obj.map(stableStringify).join(',')}]`;
  return `{${Object.keys(obj).sort().map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(',')}}`;
};

export const paramsHash = (params = {}) => {
  const str = stableStringify(params);
  return crypto.createHash('sha256').update(str).digest('hex').slice(0, 16);
};

export const aiCacheKey = ({ stockId, type, year, params }) => {
  const hash = paramsHash(params);
  return {
    PK: `STOCK#${stockId}`,
    SK: `AI#${type}#${year}#${new Date().toISOString().slice(0, 10)}#${hash}`
  };
};
