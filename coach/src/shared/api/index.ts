import axios from 'axios';
import router from '@/shared/router';
import { useNotificationStore } from '@/shared/store';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const notificationStore = useNotificationStore();

    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        router.push('/auth/sign-in');
      } else if (error.response.status === 400) {
        notificationStore.toggle(error.response.data.message || 'Ошибка запроса');
      }
    } else {
      notificationStore.toggle('Ошибка сети или сервер недоступен');
    }

    return Promise.reject(error);
  }
);

export default api;

export * from './exercises';
export * from './auth';
export * from '../../entities/client/api';
