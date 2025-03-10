import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Client } from '../types';
import { useClientsApi } from '../api';

export const useClientStore = defineStore('client', () => {
  const client = ref<Client | null>(null);
  const clientsApi = useClientsApi();

  const getClient = async (id: string) => {
    try {
      client.value = await clientsApi.getClientById(id);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    client,
    getClient,
  };
});
