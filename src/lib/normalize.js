// src/lib/normalize.js
// Helpers to clean strings and numbers from exported/quoted data

export function cleanText(v) {
  let s = String(v ?? "").trim();
  // Convert escaped quotes \"xxx\" -> "xxx"
  s = s.replace(/\\"/g, '"');
  // Remove wrapping quotes: "xxx"  'xxx'  “xxx”  ‘xxx’
  s = s.replace(/^["'“‘]+/, "").replace(/["'”’]+$/, "");
  s = s.trim();
  // Normalize placeholders to empty
  if (s === '""' || s === "''" || s === "-" || s === "--" || s === "—") return "";
  return s;
}

export function cleanStr(v) {
  return cleanText(v);
}

export function cleanNum(v) {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number" && Number.isFinite(v)) return v;

  let s = cleanStr(v);
  if (!s) return 0;

  // Remove commas and spaces
  s = s.replace(/,/g, "").replace(/\s+/g, "");

  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

export function normalizeIndustry(v) {
  const s = cleanText(v);
  return s ? s : "未分类";
}

export function isValidLabel(v) {
  const s = cleanStr(v);
  if (!s) return false;
  if (s === "***" || s.toLowerCase() === "null" || s.toLowerCase() === "undefined") return false;
  return true;
}
