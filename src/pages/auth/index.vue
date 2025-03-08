<script setup lang="ts">

</script>

<template>
  <v-layout class="auth-layout d-flex align-center">
    <v-container class="fill-height d-flex flex-column justify-center align-center">
      <h1 class="app-title">ProFitness</h1>
      <router-view/>
    </v-container>
  </v-layout>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background-color: #eef2f5;
}

.app-title {
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
}
</style>
