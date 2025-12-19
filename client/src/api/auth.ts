import api from '../shared/api';
import type { ClientProfile } from '../shared/types';

export const loginClient = async (payload: { email: string; password: string }) => {
  const { data } = await api.post('/auth/client/login', payload);
  return data as { token: string; client: ClientProfile };
};

export const fetchProfile = async () => {
  const { data } = await api.get('/clients/me');
  return data as ClientProfile;
};
