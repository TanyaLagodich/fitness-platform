import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Client } from '@/entities/client';
import { Workout } from '@/entities/workout';
import {
  Exercise,
  ExerciseInWorkout,
  ExerciseTypes,
  ExerciseWithRepeats,
} from '@/shared/types';
import { useWorkoutsApi } from '@/entities/workout';

export const useWorkoutModel = defineStore('workout', () => {
  const client = ref<Client | null>(null);

  const createEmptyWorkout = (): Workout => ({
    date: new Date(),
    name: '',
    description: '',
    clientId: client.value?._id || undefined,
    frequency: '',
    groups: [],
  });

  const workout = ref<Workout>(createEmptyWorkout());

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

  type ExerciseFromApi = Partial<ExerciseWithRepeats> & {
    _id?: Exercise | string;
    exerciseId?: Exercise | string;
  };

  type WorkoutFromApi = Partial<Omit<Workout, 'groups'>> & {
    _id?: string;
    date?: string | Date;
    groups?: Array<{
      type?: ExerciseTypes;
      exercises?: ExerciseFromApi[];
    }>;
  };

  const resolveExerciseId = (exercise: ExerciseFromApi): string | undefined => {
    if (typeof exercise._id === 'string') return exercise._id;
    if (exercise._id && typeof exercise._id === 'object') return exercise._id._id;
    if (typeof exercise.exerciseId === 'string') return exercise.exerciseId;
    if (exercise.exerciseId && typeof exercise.exerciseId === 'object') return exercise.exerciseId._id;
    return undefined;
  };

  const normalizeExerciseFromApi = (exercise: ExerciseFromApi): ExerciseWithRepeats => {
    const populated =
      (exercise._id && typeof exercise._id === 'object' ? exercise._id : undefined) ||
      (exercise.exerciseId && typeof exercise.exerciseId === 'object' ? exercise.exerciseId : undefined) ||
      {};

    return {
      _id: resolveExerciseId(exercise),
      name: populated.name ?? exercise.name ?? '',
      description: populated.description ?? exercise.description,
      bodyParts: populated.bodyParts ?? exercise.bodyParts ?? [],
      equipments: populated.equipments ?? exercise.equipments ?? [],
      tags: populated.tags ?? exercise.tags ?? [],
      videoUrl: populated.videoUrl ?? exercise.videoUrl,
      thumbnailUrl: populated.thumbnailUrl ?? exercise.thumbnailUrl,
      repeats: exercise.repeats ?? [],
    };
  };

  const normalizeWorkoutFromApi = (data: WorkoutFromApi): Workout => ({
    name: data.name ?? '',
    description: data.description,
    clientId: (data.clientId as string) ?? undefined,
    date: data.date ? new Date(data.date) : undefined,
    frequency: data.frequency,
    groups:
      data.groups?.map((group) => ({
        type: group.type ?? ExerciseTypes.Single,
        exercises: group.exercises?.map(normalizeExerciseFromApi) ?? [],
      })) ?? [],
  });

  const getWorkoutsForClient = async (): Promise<Workout[]> => {
    if (!client.value?._id) {
      throw new Error('Клиент не выбран');
    }

    const response = await workoutApi.getWorkoutsForClient(client.value._id);
    const rawWorkouts: WorkoutFromApi[] = response?.data ?? [];
    const normalizedWorkouts = rawWorkouts.map(normalizeWorkoutFromApi);

    workout.value = normalizedWorkouts[0] ?? createEmptyWorkout();
    return normalizedWorkouts;
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
