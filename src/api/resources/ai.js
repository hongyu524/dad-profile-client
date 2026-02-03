import { apiClient } from '@/lib/apiClient';

export const aiApi = {
  invoke: (payload) => apiClient.post('/ai/invoke', payload),
};
