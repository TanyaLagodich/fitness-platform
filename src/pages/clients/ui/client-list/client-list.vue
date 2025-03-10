<script setup lang="ts">
import { ref } from 'vue';
import { AddClientModal, ClientList } from "@/feature/client-management";

const isAddClientModalVisible = ref<boolean>(false);

const showAddClientModal = () => {
  isAddClientModalVisible.value = true;
};
</script>

<template>
  <v-card class="mx-auto">
    <v-card-item>
      <v-card-title class="d-flex justify-space-between">
        <span> Клиенты </span>
        <v-btn prepend-icon="$plus" variant="outlined" @click="showAddClientModal">
          Добавить клиента
        </v-btn>
      </v-card-title>
    </v-card-item>

    <v-card-text>
      <ClientList />
    </v-card-text>

    <AddClientModal v-model="isAddClientModalVisible" />
  </v-card>
</template>
