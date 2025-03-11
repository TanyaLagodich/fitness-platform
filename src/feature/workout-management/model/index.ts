import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Client } from '@/entities/client';
import { Workout } from '@/entities/workout';
import { Exercise, ExerciseInWorkout, ExerciseTypes, ExerciseWithRepeats } from '@/shared/types';
import { useWorkoutsApi } from '@/entities/workout';

export const useWorkoutModel = defineStore('workout', () => {
  const client = ref<Client | null>(null);
  const workout = ref<Workout>({
    date: new Date(),
    name: '',
    description: '',
    clientId: client.value?._id || undefined,
    frequency: '',
    groups: [],
  });

  const workoutApi = useWorkoutsApi();

  const setClient = (data: Client) => {
    client.value = data;

    workout.value.clientId = data._id;
  };

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

    workout.value.groups = [...workout.value.groups, ...mappedExercises];
  };

  const addSuperset = (newExercises: Map<string, Exercise>) => {
    const superSet = {
      type: ExerciseTypes.Superset,
      exercises: [...newExercises].map(([id, exercise]) => ({
        ...exercise,
        repeats: [],
        id,
      })),
    };

    workout.value.groups = [...workout.value.groups, superSet];
  };

  const saveWorkout = async () => {
    await workoutApi.saveWorkout({ ...workout.value });
  };

  const deleteExerciseFromWorkout = (group, groupIndex, exerciseIndex) => {
    if (group.exercises.length > 1) {
      group.exercises.splice(exerciseIndex, 1);
    } else {
      workout.value.groups.splice(groupIndex, 1);
    }
  };

  const deleteRepeatFromExercise = (exercise: ExerciseWithRepeats, index: number) => {
    exercise.repeats.splice(index, 1);
  };

  const getWorkoutsForClient = async (): Promise<Workout[]> => {
    const { data } = await workoutApi.getWorkoutsForClient(client.value._id);
    return data;
  };

  return {
    client,
    workout,
    setClient,
    addExercises,
    addSuperset,
    saveWorkout,
    deleteExerciseFromWorkout,
    deleteRepeatFromExercise,
    getWorkoutsForClient,
  };
});
