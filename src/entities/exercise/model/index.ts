import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';
import {getBodyPartList, getExercises, getExercisesForBodyPart, fetchExercisesByName } from '../api';
import { Exercise } from "@/shared/types";

export const useExercisesStore = defineStore('exercises', () => {
    const exercises = ref<Exercise[]>([]);
    const bodyParts = ref<string[]>([]);

    const fetchExercises = async ({ limit = 10, offset = 0}: { limit: number; offset: number}) => {
        try {
            const data = await getExercises({ limit, offset });
            exercises.value = data;
        } catch (err) {
            console.log(err);
        }
    }

    const getExercisesByBodyPart = async (bodyPart: string) => {
        if (!bodyPart) return;

        try {
            const data = await getExercisesForBodyPart({ bodyPart });
            exercises.value = data;
        } catch (err) {
            console.error(err);
        }
    }

    const fetchBodyPartList = async () => {
        try {
            const data = await getBodyPartList();
            bodyParts.value = data;
        } catch (err) {
            console.log(err);
        }
    }

    const getExercisesByName = async (name: string) => {
        try {
            const data = await fetchExercisesByName({ name });
            exercises.value = data;
        } catch (err) {
            console.error(err);
        }
    }

    onMounted(() => {
        Promise.all([
            fetchExercises({}),
            fetchBodyPartList(),
        ]);
    });

    return {
        exercises,
        bodyParts,
        fetchExercises,
        getExercisesByBodyPart,
        getExercisesByName,
    }
});
