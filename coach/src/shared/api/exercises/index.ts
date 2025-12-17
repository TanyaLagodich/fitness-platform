import api from '../index.ts';
import { AxiosResponse } from 'axios';
import { Exercise, ExerciseMetaData } from '@/shared/types';

export const useExercisesApi = () => {
  const createExercise = async (exercise: Exercise) => {
    try {
      await api.post('/exercises', exercise);
    } catch (err) {
      console.log(err);
    }
  };

  const getExercises = async (filters: Partial<Record<string, unknown>> = {}) => {
    try {
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) =>
            value !== undefined &&
            value !== null &&
            value !== '' &&
            (!Array.isArray(value) || value.length > 0)
        )
      );

      const response: AxiosResponse<Exercise[]> = await api.get('/exercises', {
        params: cleanedFilters,
      });
      return response.data;
    } catch (err) {
      console.log(err);
    }
  };

  const getMetaDataOfExercises = async () => {
    try {
      const response: AxiosResponse<ExerciseMetaData> = await api.get('/metaData');
      return response.data;
    } catch (err) {
      console.log(err);
      return {
        bodyParts: [],
        tags: [],
        equipments: [],
      };
    }
  };

  return {
    createExercise,
    getExercises,
    getMetaDataOfExercises,
    updateExercise: async (id: string, exercise: Exercise) => api.put(`/exercises/${id}`, exercise),
    deleteExercise: async (id: string) => api.delete(`/exercises/${id}`),
    addBodyPart: async (name: string) => api.post('/bodyParts', { name }),
    addEquipment: async (name: string) => api.post('/equipments', { name }),
    addTag: async (name: string) => api.post('/tags', { name }),
    deleteBodyPart: async (id: string) => api.delete(`/bodyParts/${id}`),
    deleteEquipment: async (id: string) => api.delete(`/equipments/${id}`),
    deleteTag: async (id: string) => api.delete(`/tags/${id}`),
    getBodyParts: async () => api.get('/bodyParts'),
    getEquipments: async () => api.get('/equipments'),
    getTags: async () => api.get('/tags'),
  };
};
