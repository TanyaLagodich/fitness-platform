<script setup lang="ts">
import { ref } from 'vue';
import type { Client } from 'shared/types';
import Header from './components/header/header.vue';
import Main from './components/main/Main.vue';
import { ClientSidebar } from '@/feature/client-management';

const client = ref<Client | null>(null);
</script>

<template>
  <router-view />
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
}
</style>
