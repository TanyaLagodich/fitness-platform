import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { loginClient, fetchProfile } from '@/api/auth';
import type { ClientProfile } from '../types';

export const useAuthStore = defineStore('client-auth', () => {
  const token = ref<string>(localStorage.getItem('client_token') || '');
  const profile = ref<ClientProfile | null>(null);
  const isAuthenticated = computed(() => Boolean(token.value));

  const setToken = (value: string) => {
    token.value = value;
    localStorage.setItem('client_token', value);
  };

  const login = async (email: string, password: string) => {
    const { token: receivedToken, client } = await loginClient({ email, password });
    setToken(receivedToken);
    profile.value = client;
    return client;
  };

  const fetchProfileAction = async () => {
    if (!token.value) return;
    profile.value = await fetchProfile();
  };

  const logout = () => {
    token.value = '';
    profile.value = null;
    localStorage.removeItem('client_token');
  };

  return {
    token,
    profile,
    isAuthenticated,
    login,
    fetchProfile: fetchProfileAction,
    logout,
  };
});
