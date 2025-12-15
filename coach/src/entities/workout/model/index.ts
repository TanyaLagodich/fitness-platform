import { ExerciseInWorkout } from '@/shared/types';

export interface Workout {
  _id?: string;
  name: string;
  description?: string;
  clientId?: string;
  date?: Date;
  frequency?: string;
  groups: ExerciseInWorkout[];
}
