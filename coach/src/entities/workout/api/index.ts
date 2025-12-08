import type { Workout } from '@/entities/workout/model';
import api from '@/shared/api';

export const useWorkoutsApi = () => {
  const saveWorkout = async (workout: Workout) => {
    try {
      await api.post('/workouts', workout);
    } catch (err) {
      console.log(err);
    }
  };

  const getWorkoutsForClient = async (clientId: string) => {
    try {
      return await api.get(`/workouts/client/${clientId}`);
    } catch (err) {
      console.log(err);
    }
  };

  return {
    saveWorkout,
    getWorkoutsForClient,
  };
};
