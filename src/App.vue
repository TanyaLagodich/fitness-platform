<script setup lang="ts">
import { useNotificationStore } from '@/shared/store';

const notificationStore = useNotificationStore();
</script>

<template>
  <router-view />

  <v-snackbar v-model="notificationStore.show" color="error" :timeout="notificationStore.TIMEOUT">
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
