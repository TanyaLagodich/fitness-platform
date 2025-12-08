import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Exercise, ExerciseInWorkout, ExerciseMetaData, ExerciseTypes } from '@/shared/types';
import { useExercisesApi } from '@/shared/api';

export const useExerciseManagementStore = defineStore('exercise-management', () => {
  const exercises = ref<ExerciseInWorkout[]>([]);
  const exerciseMetaData = ref<ExerciseMetaData>({
    bodyParts: [],
    tags: [],
    equipments: [],
  });

  const exerciseApi = useExercisesApi();

  const addExercises = (newExercises: Map<string, Exercise>) => {
    const mappedExercises: ExerciseInWorkout[] = [...newExercises].map(([id, exercise]) => {
      return {
        exercises: [
          {
            ...exercise,
            repeats: [],
            id,
          },
        ],
        type: ExerciseTypes.Single,
      };
    });

    exercises.value = [...exercises.value, ...mappedExercises];
  };

  const deleteExercise = (group: ExerciseInWorkout, index: number) => {
    if (group.type === ExerciseTypes.Single) {
      exercises.value.splice(index, 1);
    } else if (group.type === ExerciseTypes.Superset) {
      group.exercises.splice(index, 1);
      if (group.exercises.length === 0) {
        // TODO find group in exercises and remove it
        // exercises.value.splice(index, 1);
      }
    }
  };

  const addSuperset = (newExercises: Map<string, Exercise>) => {
    console.log('addSuperset', newExercises);
    const superSet = {
      type: ExerciseTypes.Superset,
      exercises: [...newExercises].map(([id, exercise]) => ({
        ...exercise,
        repeats: [],
        id,
      })),
    };

    console.log({ superSet });

    exercises.value = [...exercises.value, superSet];
  };

  const fetchExerciseMetaData = async () => {
    const data = await exerciseApi.getMetaDataOfExercises();
    exerciseMetaData.value.bodyParts = data?.bodyParts;
    exerciseMetaData.value.tags = data?.tags;
    exerciseMetaData.value.equipments = data?.equipments;
  };

  return {
    exercises,
    exerciseMetaData,
    addExercises,
    deleteExercise,
    addSuperset,
    fetchExerciseMetaData,
  };
});
