<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from './shared/store/auth';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const isAuthRoute = computed(() => route.path.startsWith('/login'));
const isAuthenticated = computed(() => authStore.isAuthenticated);

onMounted(() => {
  if (authStore.token) {
    authStore.fetchProfile();
  }
});

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <v-app>
    <v-app-bar v-if="isAuthenticated" color="primary" density="comfortable" dark>
      <v-app-bar-title>Мои тренировки</v-app-bar-title>
      <v-spacer />
      <div class="d-flex align-center ga-3">
        <div class="d-flex flex-column text-right">
          <span class="text-subtitle-2">{{ authStore.profile?.name || 'Клиент' }}</span>
          <span class="text-caption">{{ authStore.profile?.email }}</span>
        </div>
        <v-btn icon="mdi-logout" variant="text" color="white" @click="logout" />
      </div>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <router-view />
    </v-main>
  </v-app>
</template>
