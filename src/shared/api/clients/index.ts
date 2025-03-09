import api from '../index.ts';
import { Client } from '@/shared/types';

export const useClientsApi = () => {
  const getClients = async (search = '') => {
    const response = await api.get(`/clients`, { params: { search } });
    return response.data;
  };

  const addClient = async (client: Client) => {
    const response = await api.post(`/clients`, client);
    return response.data;
  };

  const updateClient = async (id: number, client: { name?: string; notes?: string }) => {
    const response = await api.put(`/clients/${id}`, client);
    return response.data;
  };

  const deleteClient = async (id: number) => {
    await api.delete(`/clients/${id}`);
  };

  const getClientById = async (id: string): Promise<Client> => {
    const { data } = await api.get(`/clients/${id}`);
    return data;
  };

  return {
    getClients,
    addClient,
    updateClient,
    deleteClient,
    getClientById,
  };
};
