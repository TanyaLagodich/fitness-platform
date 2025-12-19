import axios from 'axios';
import router from '../router';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('client_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('client_token');
      router.push({ name: 'login' });
    }
    return Promise.reject(error);
  }
);

export default api;
