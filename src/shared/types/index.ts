export interface Client {
    _id?: string;
    name: string;
    email: string;
    notes?: string;
    photo?: string;
}

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
    Single= 'Single',
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

interface Superset {
    id: string;
    type: 'superset';
    name: string;
    exercises: Exercise[];
    repeats: number;
}

export interface Plan {
    dateEnd: string;
    dateStart: string;
    description: string;
    exercises: (Exercise | Superset)[];
    name: string;
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
