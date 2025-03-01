import { Workout } from '@/shared/types';
import api from "@/shared/api";

export const useWorkoutsApi = () => {
    const saveWorkout = async (workout: Workout) => {
        try {
            await api.post('/workouts', workout);
        } catch (err) {
            console.log(err);
        }
    }

    return {
        saveWorkout,
    };
}
