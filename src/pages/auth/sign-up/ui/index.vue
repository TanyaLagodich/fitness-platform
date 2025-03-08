<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSignUpModel } from '../model';

const router = useRouter();
const signUpModel = useSignUpModel();
const form = ref();
const loading = ref(false);
const errorMessage = ref('');

const passwordVisibility = ref<Record<'password' | 'confirmPassword', boolean>>({
  password: false,
  confirmPassword: false,
});

const toggleVisibilityPassword = (key: 'password' | 'confirmPassword'): void => {
  passwordVisibility.value[key] = !passwordVisibility.value[key];
};

const rules = {
  required: (v: string) => !!v || 'Это поле обязательно',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Введите корректный email',
  password: (v: string) => v.length >= 6 || 'Пароль должен быть минимум 6 символов',
  confirmPassword: (v: string) =>
    (v.length && signUpModel.newCoach.password && v === signUpModel.newCoach.password) ||
    'Пароли не совпадают',
};

const signUp = async () => {
  const { valid } = await form.value.validate();

  if (!valid) return;
  loading.value = true;

  try {
    await signUpModel.registerNewCoach();

    router.push({ path: '/' });
  } catch (error) {
    errorMessage.value = 'Ошибка регистрации';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <v-card class="pa-6" elevation="6" max-width="500" width="100%">
    <v-card-title class="text-h5 text-center">Регистрация</v-card-title>

    <v-card-text>
      <v-form ref="form" :fast-fail="true" @submit.prevent="signUp">
        <v-text-field
          v-model="signUpModel.newCoach.name"
          label="Имя"
          variant="outlined"
          :clearable="true"
          :required="true"
          :rules="[rules.required]"
        />
        <v-text-field
          v-model="signUpModel.newCoach.email"
          label="Email"
          type="email"
          variant="outlined"
          :clearable="true"
          :required="true"
          :rules="[rules.required, rules.email]"
        />
        <v-text-field
          v-model="signUpModel.newCoach.password"
          label="Пароль"
          :type="passwordVisibility.password ? 'text' : 'password'"
          variant="outlined"
          :clearable="true"
          :required="true"
          :append-inner-icon="passwordVisibility.password ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[rules.required, rules.password]"
          @click:append-inner="toggleVisibilityPassword('password')"
        />
        <v-text-field
          v-model="signUpModel.newCoach.confirmPassword"
          label="Повторите пароль"
          :type="passwordVisibility.confirmPassword ? 'text' : 'password'"
          variant="outlined"
          :clearable="true"
          :required="true"
          :rules="[rules.required, rules.confirmPassword]"
          :append-inner-icon="passwordVisibility.confirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="toggleVisibilityPassword('confirmPassword')"
        />

        <v-btn :loading="loading" color="primary" block class="mt-4" size="large" @click="signUp">
          Зарегистрироваться
        </v-btn>
      </v-form>

      <v-btn variant="text" color="blue" block class="mt-2" @click="router.push('/auth/sign-in')">
        Уже есть аккаунт? Войти
      </v-btn>
    </v-card-text>
  </v-card>
</template>
