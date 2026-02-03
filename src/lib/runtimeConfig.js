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
        console.info("[runtimeConfig] loading", { configUrl });
        const res = await fetch(configUrl, { cache: "no-store" });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          console.error("[runtimeConfig] config fetch failed", { status: res.status, url: configUrl, bodyPreview: text.slice(0, 200) });
          throw new Error(`Failed to load config.json (status ${res.status}) at ${configUrl}`);
        }
        let json;
        try {
          json = await res.json();
        } catch (err) {
          console.error("config.json parse error:", err);
          throw new Error(`Invalid JSON in config.json at ${configUrl}`);
        }
        if (!json?.apiBaseUrl) throw new Error("Missing config.json or apiBaseUrl");
        config = {
          apiBaseUrl: String(json.apiBaseUrl).trim(),
          defaultYear: json.defaultYear ?? null,
        };
        console.log("Runtime config loaded:", { apiBaseUrl: config.apiBaseUrl, defaultYear: config.defaultYear, configUrl });
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
