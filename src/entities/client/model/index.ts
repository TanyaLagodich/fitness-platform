import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Client } from '@/shared/types';
import { getClientById } from '@/services/api.ts';

export const useClientStore = defineStore('client', () => {
  const client = ref<Client | null>(null);

  const getClient = async (id: string) => {
    try {
      client.value = await getClientById(id);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    client,
    getClient,
  };
});
