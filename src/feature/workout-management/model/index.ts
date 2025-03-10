import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Client } from '@/entities/client';
import { Workout } from '@/entities/workout';
import { Exercise, ExerciseInWorkout, ExerciseTypes, ExerciseWithRepeats } from '@/shared/types';
import { useWorkoutsApi } from '@/shared/api/workouts';

export const useWorkoutModel = defineStore('workout', () => {
  const client = ref<Client | null>(null);
  const workout = ref<Workout>({
    date: new Date(),
    name: '',
    description: '',
    clientId: client.value?._id || undefined,
    frequency: '',
    exercises: [],
  });

  const setClient = (data: Client) => {
    client.value = data;
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

    workout.value.exercises = [...workout.value.exercises, ...mappedExercises];
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

    workout.value.exercises = [...workout.value.exercises, superSet];
  };

  const saveWorkout = async () => {
    const workoutApi = useWorkoutsApi();
    await workoutApi.saveWorkout(workout.value);
  };

  const deleteExerciseFromWorkout = (group, groupIndex, exerciseIndex) => {
    if (group.exercises.length > 1) {
      group.exercises.splice(exerciseIndex, 1);
    } else {
      workout.value.exercises.splice(groupIndex, 1);
    }
  };

  const deleteRepeatFromExercise = (exercise: ExerciseWithRepeats, index: number) => {
    exercise.repeats.splice(index, 1);
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
  };
});
