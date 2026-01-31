import { apiClient } from '../apiClient';

export const aiApi = {
  invoke: (payload) => apiClient.post('/ai/invoke', payload),
};
