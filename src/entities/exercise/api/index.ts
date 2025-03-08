import axios from 'axios';
import { Exercise } from '@/shared/types';

const api = axios.create({
  baseURL: 'https://exercisedb.p.rapidapi.com/',
  timeout: 10000,
  headers: {
    'x-rapidapi-key': import.meta.env.VITE_RAPID_API_KEY,
  },
});

export const getExercises = async ({
  limit = 10,
  offset = 0,
}: {
  limit: number;
  offset: number;
}): Promise<Exercise[]> => {
  try {
    const response = await api.get(`/exercises?limit=${limit}&offset=${offset}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getBodyPartList = async () => {
  const response = await api.get('/exercises/bodyPartList ');
  return response.data;
};

export const getExercisesForBodyPart = async ({
  bodyPart,
  limit = 10,
  offset = 0,
}: {
  bodyPart: string;
  limit: number;
  offset: number;
}) => {
  const response = await api.get(`/exercises/bodyPart/${bodyPart}?limit=${limit}&offset=${offset}`);
  return response.data;
};

export const fetchExercisesByName = async ({
  name,
  limit = 10,
  offset = 0,
}: {
  name: string;
  limit: number;
  offset: number;
}) => {
  const response = await api.get(`/exercises/name/${name}?limit=${limit}&offset=${offset}`);
  return response.data;
};
