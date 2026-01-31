import { apiClient } from '../apiClient';

const resourcePath = '/stocks';

export const stocksApi = {
  list: () => apiClient.get(resourcePath),
  create: (data) => apiClient.post(resourcePath, data),
  update: (id, data) => apiClient.put(`${resourcePath}/${id}`, data),
  remove: (id) => apiClient.del(`${resourcePath}/${id}`),
};
