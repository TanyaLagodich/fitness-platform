export interface Exercise {
  _id?: string;
  name: string;
  description?: string;
  bodyParts: string[];
  equipments: string[];
  tags: string[];
  videoUrl?: string;
  thumbnailUrl?: string;
}

export enum ExerciseTypes {
  Single = 'Single',
  Superset = 'Superset',
}

export interface ExerciseInWorkout {
  type: ExerciseTypes;
  exercises: ExerciseWithRepeats[];
}

export interface ExerciseWithRepeats extends Exercise {
  repeats: Repeat[];
}

export interface Repeat {
  count: number;
  countMax: number;
  dropset: [];
  percent: number;
  relax: number;
  stressMark: number;
  virtual: boolean;
  weight: number;
}

export interface Workout {
  name: string;
  description?: string;
  clientId?: string;
  trainerId: string;
  date?: Date;
  frequency?: string;
  exercises: ExerciseInWorkout[];
  createdAt: Date;
}

// TODO find a better place for this interface
export interface QueryParams {
  limit: number;
  offset: number;
}

export interface ExerciseMetaData {
  bodyParts: string[];
  equipments: string[];
  tags: string[];
}
