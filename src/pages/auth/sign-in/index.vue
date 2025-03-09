<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthApi } from '@/shared/api';

const router = useRouter();
const authApi = useAuthApi();
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const loading = ref(false);
const errorMessage = ref('');

const signIn = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const data = await authApi.login({ email: email.value, password: password.value });
    localStorage.setItem('token', data.token);
    router.push('/home');
  } catch (error) {
    errorMessage.value = 'Ошибка входа. Проверьте данные и попробуйте снова.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <v-card class="pa-6" elevation="6" max-width="500" width="100%">
    <v-card-title class="text-h5 text-center">Вход в аккаунт</v-card-title>

    <v-card-text>
      <v-text-field
        v-model="email"
        label="Email"
        type="email"
        variant="outlined"
        clearable
        required
      />
      <v-text-field
        v-model="password"
        label="Пароль"
        type="password"
        variant="outlined"
        clearable
        required
      />
      <v-checkbox v-model="rememberMe" label="Запомнить меня" class="mt-1" />

      <v-btn :loading="loading" color="primary" block class="mt-4" size="large" @click="signIn">
        Войти
      </v-btn>

      <v-btn variant="text" color="blue" block class="mt-2" @click="router.push('/auth/sign-up')">
        Нет аккаунта? Зарегистрироваться
      </v-btn>
    </v-card-text>
  </v-card>
</template>
