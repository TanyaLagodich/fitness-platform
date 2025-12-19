export type WorkoutStatus = 'planned' | 'in-progress' | 'completed';

export interface Repeat {
  count?: number;
  time?: string;
  weight?: number;
  distance?: number;
  notes?: string;
}

export interface Exercise {
  _id?: string;
  name: string;
  description?: string;
  bodyParts?: string[];
  equipments?: string[];
  tags?: string[];
  videoUrl?: string;
  thumbnailUrl?: string;
  repeats?: Repeat[];
  notes?: string;
}

export interface ExerciseGroup {
  type: 'Single' | 'Superset';
  exercises: Exercise[];
}

export interface Workout {
  _id?: string;
  name: string;
  description?: string;
  clientId?: string;
  date?: string | Date;
  frequency?: string;
  status?: WorkoutStatus;
  progressNotes?: { note: string; createdAt: string | Date }[];
  progressVideoUrl?: string;
  completedAt?: string | Date;
  groups: ExerciseGroup[];
}

export interface ClientProfile {
  _id?: string;
  name?: string;
  email?: string;
  notes?: string;
}
