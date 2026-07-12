import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'An error occurred';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

export const getDashboard = async () => {
  const response = await api.get('/reports/dashboard');
  return response.data;
};

export const getReports = async (params = {}) => {
  const response = await api.get('/reports', { params });
  return response.data;
};

export const exportCSV = async (params = {}) => {
  const response = await api.get('/reports/export', {
    params,
    responseType: 'blob',
  });
  return response;
};

export default api;
