import api from '../shared/api';
import type { Workout, WorkoutStatus } from '../shared/types';

export const fetchMyWorkouts = async (): Promise<Workout[]> => {
  const { data } = await api.get('/workouts/client/me');
  return data as Workout[];
};

export const fetchWorkoutById = async (id: string): Promise<Workout> => {
  const { data } = await api.get(`/workouts/${id}`);
  return data as Workout;
};

export const updateWorkoutProgress = async (
  id: string,
  payload: { status?: WorkoutStatus; note?: string; progressVideoUrl?: string }
): Promise<Workout> => {
  const { data } = await api.patch(`/workouts/${id}/progress`, payload);
  return data as Workout;
};

export const uploadWorkoutVideo = async (id: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post(`/workouts/${id}/video`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data as { url: string; workout: Workout };
};
