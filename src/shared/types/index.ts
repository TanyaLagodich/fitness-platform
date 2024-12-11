export interface Client {
    id?: number;
    name: string;
    email: string;
    notes?: string;
}

export interface Exercise {
    bodyPart: string;
    equipment: string;
    gifUrl: string;
    id: string;
    name: string;
    target: string;
    secondaryMuscles: string[];
    instructions: string[];
}


export interface ExerciseInWorkout {
    type: 'single' | 'superset';
    exercises: (Exercise & { repeats: Repeat[] })[];
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
