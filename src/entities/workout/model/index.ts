import { ExerciseInWorkout } from '@/shared/types';

export interface Workout {
  name: string;
  description?: string;
  clientId?: string;
  date?: Date;
  frequency?: string;
  exercises: ExerciseInWorkout[];
}
