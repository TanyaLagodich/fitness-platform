import api from '../index.ts';
import { AxiosResponse } from 'axios';

export const useAuthApi = () => {
  const registerNewCoach = async (data) => {
    try {
      const response: AxiosResponse<{}> = await api.post('/auth/register', data);
      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  return {
    registerNewCoach,
  };
};
