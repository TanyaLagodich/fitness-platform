import axios from 'axios';
import { useNotificationStore } from '@/shared/store';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log(token);
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
    console.log('error');
    const notificationStore = useNotificationStore();

    if (error.response) {
      if (error.response.status === 400) {
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
export * from './workouts';
export * from './auth';
export * from './clients';
