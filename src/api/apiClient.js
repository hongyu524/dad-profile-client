const baseURL = import.meta.env.VITE_API_BASE_URL || "https://olvu4z746i7cxbvaujekdfa2li0rrlym.lambda-url.us-west-2.on.aws";

const buildUrl = (path) => {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${baseURL}${p}`;
};

const handleResponse = async (response) => {
  const text = await response.text();
  const data = text ? JSON.parse(text).catch(() => text) : null;
  if (!response.ok) {
    const err = new Error(data?.message || `Request failed (${response.status})`);
    err.status = response.status;
    err.data = data;
    throw err;
  }
  return data;
};

const jsonHeaders = { "Content-Type": "application/json" };

export const apiClient = {
  get: async (path) => handleResponse(await fetch(buildUrl(path), { method: "GET", headers: jsonHeaders })),
  post: async (path, body) =>
    handleResponse(
      await fetch(buildUrl(path), { method: "POST", headers: jsonHeaders, body: JSON.stringify(body ?? {}) })
    ),
  put: async (path, body) =>
    handleResponse(
      await fetch(buildUrl(path), { method: "PUT", headers: jsonHeaders, body: JSON.stringify(body ?? {}) })
    ),
  del: async (path) => handleResponse(await fetch(buildUrl(path), { method: "DELETE", headers: jsonHeaders })),
};
