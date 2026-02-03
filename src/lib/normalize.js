// src/lib/normalize.js
// Helpers to clean strings and numbers from exported/quoted data

export function cleanStr(v) {
  if (v === null || v === undefined) return "";
  let s = String(v);

  // Trim whitespace
  s = s.trim();

  // Convert escaped quotes \" -> "
  s = s.replace(/\\"/g, '"');

  // Strip wrapping quotes repeatedly (handles "\"000001\"" or "'化工'")
  while (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }

  // Normalize placeholders to empty
  if (s === '""' || s === "''" || s === "-" || s === "--" || s === "—") return "";
  return s.trim();
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

export function isValidLabel(v) {
  const s = cleanStr(v);
  if (!s) return false;
  if (s === "***" || s.toLowerCase() === "null" || s.toLowerCase() === "undefined") return false;
  return true;
}
