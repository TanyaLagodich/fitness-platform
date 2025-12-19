<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/shared/store/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');

const submit = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    await authStore.login(email.value, password.value);
    const redirect = (route.query.redirect as string) || '/workouts';
    router.push(redirect);
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.message || 'Не удалось войти. Проверьте логин и пароль.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="d-flex align-center justify-center" style="min-height: 100vh;">
    <v-card elevation="6" class="pa-6" max-width="480" width="100%">
      <v-card-title class="text-h5 text-center mb-2">Вход для клиента</v-card-title>
      <v-card-subtitle class="text-center mb-4">Используйте логин и пароль, отправленные тренером</v-card-subtitle>

      <v-text-field v-model="email" label="Email" type="email" variant="outlined" required />
      <v-text-field v-model="password" label="Пароль" type="password" variant="outlined" required />

      <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4">
        {{ errorMessage }}
      </v-alert>

      <v-btn block color="primary" class="mt-2" :loading="loading" @click="submit">
        Войти
      </v-btn>
    </v-card>
  </div>
</template>
