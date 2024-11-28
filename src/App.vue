<script setup lang="ts">
import { ref } from 'vue';
import type { Client } from '@/types';
import Header from './components/header/header.vue';
import Clients from './components/clients/clients.vue';
import Main from './components/main/Main.vue';

const client = ref<Client | null>(null);
</script>

<template>
  <el-container class="container">
    <Header />
    <el-container>
      <Clients v-model="client" />
      <Main :client="client" />
<!--      <el-main>-->
<!--        <router-view />-->
<!--      </el-main>-->
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
}
</style>
