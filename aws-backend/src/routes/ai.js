import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { ddbPut, ddbGet } from '../lib/ddb.js';
import { aiCacheKey } from '../lib/cache.js';
import { invokeBedrock } from '../lib/bedrock.js';

const TABLE_NAME = process.env.TABLE_NAME;

const loadPrompt = (type) => {
  const p = path.resolve(path.dirname(new URL(import.meta.url).pathname), `../../prompts/${type}.txt`);
  return fs.readFileSync(p, 'utf8');
};

const renderPrompt = (template, context = {}) => {
  return template.replace(/\$\{(\w+)\}/g, (_, key) => context[key] ?? '');
};

const parseJsonStrict = (text) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
};

// simple daily token-bucket per IP
const BUCKET_LIMIT = 30;
const buckets = new Map(); // key: ip, value {count, resetTs}

const checkRateLimit = (ip) => {
  if (!ip) return { allowed: true };
  const now = Date.now();
  const today = new Date().setHours(0, 0, 0, 0);
  const bucket = buckets.get(ip);
  if (!bucket || bucket.resetTs !== today) {
    buckets.set(ip, { count: 1, resetTs: today });
    return { allowed: true };
  }
  if (bucket.count >= BUCKET_LIMIT) return { allowed: false, remaining: 0 };
  bucket.count += 1;
  return { allowed: true, remaining: BUCKET_LIMIT - bucket.count };
};

export const aiInvoke = async (event, headers = {}) => {
  const body = JSON.parse(event.body || '{}');
  const { stockId, type, params = {}, stock } = body;
  if (!stockId || !type) {
    return { statusCode: 400, headers, body: JSON.stringify({ message: 'stockId and type required' }) };
  }

  // family code check
  const expected = process.env.FAMILY_CODE;
  if (expected) {
    const provided = event.headers?.['x-family-code'] || event.headers?.['X-Family-Code'];
    if (!provided || provided !== expected) {
      return { statusCode: 401, headers, body: JSON.stringify({ message: 'Unauthorized' }) };
    }
  }

  const ip = event?.requestContext?.http?.sourceIp;
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return { statusCode: 429, headers, body: JSON.stringify({ message: 'AI rate limit exceeded' }) };
  }

  const year = params.year || new Date().getFullYear();
  const cacheKey = aiCacheKey({ stockId, type, year, params });
  const cacheRes = await ddbGet({ Key: cacheKey });
  if (cacheRes.Item && cacheRes.Item.payload) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ...cacheRes.Item.payload, cached: true })
    };
  }

  const template = loadPrompt(type);
  const prompt = renderPrompt(template, { ...stock, ...params });

  let parsed = null;
  let raw = '';
  let attempts = 0;
  const maxTokens = Math.min(params.max_tokens || 1200, 2000);
  const temperature = Math.min(params.temperature || 0, 1);

  while (attempts < 3 && !parsed) {
    attempts += 1;
    raw = await invokeBedrock(prompt, { maxTokens, temperature });
    parsed = parseJsonStrict(raw);
    if (!parsed) {
      const correction = `仅输出有效JSON，匹配之前的schema，不要添加额外文字。\n原始回复：${raw}`;
      raw = await invokeBedrock(correction, { maxTokens: 256, temperature: 0 });
      parsed = parseJsonStrict(raw);
    }
  }

  if (!parsed) {
    return { statusCode: 500, headers, body: JSON.stringify({ message: 'AI response invalid JSON' }) };
  }

  const item = {
    ...cacheKey,
    payload: parsed,
    created_at: new Date().toISOString(),
    ttl: Math.floor(Date.now() / 1000) + 86400,
  };
  await ddbPut({ Item: item });

  const usage = parsed?.usage || {};
  console.log('ai.invoke', {
    stockId,
    type,
    attempts,
    prompt_len: prompt.length,
    response_len: raw.length,
    usage,
  });

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ ...parsed, cached: false })
  };
};
