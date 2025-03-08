import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthApi } from "@/shared/api";

export const useSignUpModel = defineStore('sign-up', () => {
    const newCoach = ref({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const registerNewCoach = async () => {
        const authApi = useAuthApi();
        const data = await authApi.registerNewCoach(newCoach.value);
        if (data.token) {
            localStorage.setItem('token', data.token);
        }

    }

    return {
        newCoach,
        registerNewCoach,
    };
});
