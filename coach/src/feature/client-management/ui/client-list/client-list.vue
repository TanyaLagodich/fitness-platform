<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { ClientCard } from '@/entities/client';
import { useClientModel } from '../../model';

const clientModel = useClientModel();
const isLoaded = ref(false);

const hasClients = computed(() => clientModel.clients.length > 0);

onMounted(async () => {
  await clientModel.getAllClients();
  isLoaded.value = true;
});
</script>

<template>
  <div>
    <v-skeleton-loader
      v-if="!isLoaded"
      type="list-item-two-line, list-item-two-line, list-item-two-line"
      class="mt-2"
    />

    <v-empty-state
      v-else-if="!hasClients"
      icon="$warning"
      title="Клиенты не найдены"
      text="Добавьте клиентов, чтобы быстро назначать тренировки."
      class="my-6"
    />

    <v-row v-else dense>
      <v-col v-for="client in clientModel.clients" :key="client._id" cols="12" sm="6" md="4" lg="3">
        <ClientCard :client="client" />
      </v-col>
    </v-row>
  </div>
</template>
