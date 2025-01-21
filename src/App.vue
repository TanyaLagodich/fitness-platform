<script setup lang="ts">
import { ref } from 'vue';
import type { Client } from 'shared/types';


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
