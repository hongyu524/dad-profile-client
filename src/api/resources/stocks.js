import { apiClient } from '@/lib/apiClient';

const resourcePath = '/stocks';

export const stocksApi = {
  list: async (year) => {
    const data = await apiClient.get(year ? `${resourcePath}?year=${encodeURIComponent(year)}` : resourcePath);
    console.info("[stocks] RAW API RESPONSE", data);
    if (Array.isArray(data)) {
      console.info("[stocks] treating response as array", data.length);
      return data;
    }
    const items = Array.isArray(data?.items) ? data.items : [];
    console.info("[stocks] items length:", items.length);
    return items;
  },
  create: (data) => apiClient.post(resourcePath, data),
  update: (id, data) => apiClient.put(`${resourcePath}/${id}`, data),
  remove: (id) => apiClient.del(`${resourcePath}/${id}`),
};
