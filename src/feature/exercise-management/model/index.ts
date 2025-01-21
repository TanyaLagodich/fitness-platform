import {defineStore} from "pinia";
import { ref } from 'vue';
import {Exercise, ExerciseInWorkout} from "@/shared/types";

export const useExerciseManagementStore = defineStore('exercise-management', () => {
    const exercises = ref<ExerciseInWorkout[]>([]);

    const addExercises = (newExercises: Exercise[]) => {
        const mappedExercises: ExerciseInWorkout[] = [...newExercises].map((exercise) => ({
            exercises: [
                {
                    ...exercise,
                    repeats: [],
                }
            ],
            type: 'single',
        }));

        exercises.value = [...exercises.value, ...mappedExercises];
    };

    const deleteExercise = (group, exercise: ExerciseInWorkout, index: number) => {
        if (group.type === 'single') {
            exercises.value.splice(index, 1);
        } else if (group.type === 'superset') {
            group.exercises.splice(index, 1);
            if (group.exercises.length === 0) {
                // TODO find group in exercises and remove it
                // exercises.value.splice(index, 1);
            }
        }
    }

    const addSuperset = (newExercises: Exercise[]) => {
        const superSet = {
            type: 'superset',
            exercises: [...newExercises].map((exercise) => ({
                ...exercise,
                repeats: [],
            })),
        };

        exercises.value = [...exercises.value, superSet];
    }

    return {
        exercises,
        addExercises,
        deleteExercise,
        addSuperset,
    }
});
