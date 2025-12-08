import api from '@/shared/api';
import { Client } from '../model';
import { Workout } from '@/entities/workout';

export const useClientsApi = () => {
  const getClients = async (search = '') => {
    const params = search ? { search } : undefined;
    const response = await api.get(`/clients`, { params });
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
