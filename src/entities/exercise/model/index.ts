import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';
import {
  getBodyPartList,
  getExercises,
  getExercisesForBodyPart,
  fetchExercisesByName,
} from '../api';
import { Exercise, QueryParams } from '@/shared/types';

export const useExercisesStore = defineStore('exercises', () => {
  const exercises = ref<Exercise[]>([]);
  const bodyParts = ref<string[]>([]);
  const isLoading = ref<boolean>(false);

  const fetchExercises = async (query: QueryParams = { limit: 20, offset: 0 }) => {
    isLoading.value = true;
    try {
      const data = await getExercises(query);
      exercises.value = query.offset > 0 ? [...exercises.value, ...data] : data;
    } catch (err) {
      console.error('Failed to fetch exercises:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const getExercisesByBodyPart = async (
    bodyPart: string,
    query: QueryParams = { limit: 20, offset: 0 }
  ) => {
    if (!bodyPart) return;

    isLoading.value = true;
    try {
      const data = await getExercisesForBodyPart({ bodyPart, ...query! });
      exercises.value = query.offset > 0 ? [...exercises.value, ...data] : data;
    } catch (err) {
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchBodyPartList = async () => {
    try {
      const data = await getBodyPartList();
      bodyParts.value = data;
    } catch (err) {
      console.log(err);
    }
  };

  const getExercisesByName = async (
    name: string,
    query: QueryParams = { limit: 20, offset: 0 }
  ) => {
    isLoading.value = true;
    try {
      const data = await fetchExercisesByName({ name, ...query! });
      exercises.value = query.offset > 0 ? [...exercises.value, ...data] : data;
    } catch (err) {
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    Promise.all([fetchExercises(), fetchBodyPartList()]);
  });

  return {
    exercises,
    bodyParts,
    isLoading,
    fetchExercises,
    getExercisesByBodyPart,
    getExercisesByName,
  };
});
