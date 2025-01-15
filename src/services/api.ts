import axios from 'axios';
import { Client } from '@/shared/types';

const api = axios.create({
    baseURL: 'http://localhost:4000/api', // Базовый URL вашего бэкенда
});

export const getClients = async (search = '') => {
    const response = await api.get(`/clients`, { params: { search } });
    return response.data;
};

export const addClient = async (client: { name: string; notes: string }) => {
    const response = await api.post(`/clients`, client);
    return response.data;
};

export const updateClient = async (id: number, client: { name?: string; notes?: string }) => {
    const response = await api.put(`/clients/${id}`, client);
    return response.data;
};

export const deleteClient = async (id: number) => {
    await api.delete(`/clients/${id}`);
};

export const getClientById = async (id: number): Promise<Client> => {
    const { data } =  await api.get(`/clients/${id}`);
    return data;
}
