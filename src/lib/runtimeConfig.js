"use strict";

let config = null;
let loadError = null;
let loadPromise = null;

export async function loadRuntimeConfig() {
  if (config || loadError) return { config, error: loadError };
  if (!loadPromise) {
    loadPromise = (async () => {
      try {
        const baseUrl = (typeof import.meta !== 'undefined' ? import.meta.env?.BASE_URL : process.env?.BASE_URL) || '/';
        const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
        const configUrl = `${normalizedBase}config.json`;
        const res = await fetch(configUrl, { cache: "no-cache" });
        if (!res.ok) throw new Error(`Failed to load config.json (status ${res.status})`);
        const json = await res.json();
        if (!json?.apiBaseUrl) throw new Error("Missing config.json or apiBaseUrl");
        config = { apiBaseUrl: String(json.apiBaseUrl).trim() };
        console.log("Runtime config loaded:", { apiBaseUrl: config.apiBaseUrl, configUrl });
      } catch (err) {
        loadError = err;
        console.error("Runtime config load error:", err);
        throw err;
      }
    })();
  }
  await loadPromise;
  return { config, error: loadError };
}

export function getApiBaseUrl() {
  if (loadError) throw loadError;
  if (!config?.apiBaseUrl) throw new Error("Missing config.json or apiBaseUrl");
  return config.apiBaseUrl;
}

export function getRuntimeConfig() {
  return { config, error: loadError };
}
