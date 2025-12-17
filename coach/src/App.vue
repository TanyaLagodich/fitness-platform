<script setup lang="ts">
import { computed } from 'vue';
import { useNotificationStore } from '@/shared/store';

const notificationStore = useNotificationStore();

const color = computed(() =>
  notificationStore.severity === 'error'
    ? 'error'
    : notificationStore.severity === 'success'
    ? 'success'
    : 'primary'
);
</script>

<template>
  <router-view />
  <v-snackbar v-model="notificationStore.show" :color="color" :timeout="notificationStore.TIMEOUT">
    {{ notificationStore.message }}

    <template v-slot:actions>
      <v-btn icon="mdi-close" @click="() => notificationStore.toggle()" />
    </template>
  </v-snackbar>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
}
</style>
