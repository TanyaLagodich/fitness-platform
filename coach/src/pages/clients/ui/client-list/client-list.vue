<script setup lang="ts">
import { ref } from 'vue';
import { AddClientModal, ClientList } from '@/feature/client-management';

const isAddClientModalVisible = ref<boolean>(false);

const showAddClientModal = () => {
  isAddClientModalVisible.value = true;
};
</script>

<template>
  <v-card class="mx-auto" elevation="3">
    <v-card-item>
      <div class="d-flex align-center justify-space-between flex-wrap ga-2">
        <div>
          <v-card-title class="pa-0 mb-1 text-h6">Клиенты</v-card-title>
          <v-card-subtitle class="pa-0">Управляйте списком клиентов и назначениями</v-card-subtitle>
        </div>
        <v-btn prepend-icon="$plus" variant="flat" color="primary" @click="showAddClientModal">
          Добавить клиента
        </v-btn>
      </div>
    </v-card-item>

    <v-divider />

    <v-card-text>
      <ClientList />
    </v-card-text>

    <AddClientModal v-model="isAddClientModalVisible" />
  </v-card>
</template>
