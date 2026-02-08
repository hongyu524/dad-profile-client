"use strict";

const familyCode = (typeof import.meta !== "undefined" ? import.meta.env?.VITE_FAMILY_CODE : process.env?.VITE_FAMILY_CODE) || "";
const jsonHeaders = { "Content-Type": "application/json", ...(familyCode ? { "x-family-code": familyCode } : {}) };

let apiBaseUrl = null;
let configSource = null; // 'config.json' | 'env'
let loadPromise = null;
let loadError = null;

async function ensureConfig() {
  if (apiBaseUrl || loadError) return { apiBaseUrl, loadError, configSource };
  if (!loadPromise) {
    loadPromise = (async () => {
      const envBase = (typeof import.meta !== "undefined" ? import.meta.env?.VITE_API_BASE_URL : process.env?.VITE_API_BASE_URL) || "";
      const baseUrl = (typeof import.meta !== "undefined" ? import.meta.env?.BASE_URL : process.env?.BASE_URL) || "/";
      const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
      const configUrl = `${normalizedBase}config.json`;
      try {
        console.info("[apiClient] loading config.json from", configUrl);
        const res = await fetch(configUrl, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load config.json (${res.status}) at ${configUrl}`);
        let json;
        try {
          json = await res.json();
        } catch (err) {
          console.error("[apiClient] config.json parse error", err);
          throw new Error(`Invalid JSON in config.json at ${configUrl}`);
        }
        const base = String(json?.apiBaseUrl || "").trim();
        if (!base) throw new Error("Missing apiBaseUrl in config.json");
        apiBaseUrl = base.replace(/\/+$/, ""); // trim trailing slash
        configSource = "config.json";
        console.info("[apiClient] apiBaseUrl =", apiBaseUrl, "source=config.json");
      } catch (err) {
        if (envBase) {
          apiBaseUrl = String(envBase).trim().replace(/\/+$/, "");
          configSource = "env";
          console.warn("[apiClient] config.json load failed, falling back to env VITE_API_BASE_URL:", err?.message);
        } else {
          loadError = err;
          console.error("[apiClient] config load error", err);
          throw err;
        }
      }
    })();
  }
  await loadPromise;
  return { apiBaseUrl, loadError, configSource };
}

const buildUrl = (path) => {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${apiBaseUrl}${p}`;
};

const handleResponse = async (response) => {
  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  if (!response.ok) {
    const err = new Error(data?.message || `Request failed (${response.status})`);
    err.status = response.status;
    err.data = data;
    throw err;
  }
  return data;
};

export const apiClient = {
  get: async (path) => {
    await ensureConfig();
    return handleResponse(await fetch(buildUrl(path), { method: "GET", headers: jsonHeaders }));
  },
  post: async (path, body) => {
    await ensureConfig();
    const url = buildUrl(path);
    if (path.includes("/ai/invoke")) console.log("AI invoke URL:", url);
    return handleResponse(await fetch(url, { method: "POST", headers: jsonHeaders, body: JSON.stringify(body ?? {}) }));
  },
  put: async (path, body) => {
    await ensureConfig();
    return handleResponse(await fetch(buildUrl(path), { method: "PUT", headers: jsonHeaders, body: JSON.stringify(body ?? {}) }));
  },
  del: async (path) => {
    await ensureConfig();
    return handleResponse(await fetch(buildUrl(path), { method: "DELETE", headers: jsonHeaders }));
  },
};

export function getApiClientDiagnostics() {
  return { apiBaseUrl, loadError, configSource };
}
