<script setup lang="ts">
import { onMounted } from 'vue';
import { ClientCard } from '@/entities/client';
import { useClientModel } from '../../model';

const clientModel = useClientModel();

onMounted(clientModel.getAllClients);
</script>

<template>
  <v-row>
    <v-col v-for="client in clientModel.clients" :key="client._id" cols="4">
      <ClientCard :client="client" />
    </v-col>
  </v-row>
</template>
