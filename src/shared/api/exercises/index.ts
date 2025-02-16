import api from '../index.ts';
import { AxiosResponse } from 'axios';
import {Exercise, ExerciseMetaData} from '@/shared/types';

export const useExercisesApi = () => {
    const createExercise = async (exercise: Exercise) => {
        try {
            await api.post('/exercises', exercise);
        } catch (err) {
            console.log(err);
        }
    }

    const getExercises = async (filters: Partial<QueryParams> = {}) => {
        try {
            const cleanedFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, value]) =>
                    value !== undefined && value !== null && value !== '' && (!Array.isArray(value) || value.length > 0)
                )
            );

            const response: AxiosResponse<Exercise[]> = await api.get('/exercises', { params: cleanedFilters });
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }

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
            }
        }
    }

    return {
        createExercise,
        getExercises,
        getMetaDataOfExercises,
    };
}