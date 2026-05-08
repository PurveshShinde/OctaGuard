import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const scansService = {
  submitScan: async (targetUrl) => {
    const response = await api.post('/scans', { targetUrl });
    return response.data;
  },
  getScans: async () => {
    const response = await api.get('/scans');
    return response.data;
  },
  getScanDetails: async (id) => {
    const response = await api.get(`/scans/${id}`);
    return response.data;
  },
};

export default api;
