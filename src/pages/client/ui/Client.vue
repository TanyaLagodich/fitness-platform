<script setup lang="ts">
import { useClientStore } from '@/entities/client';
import { useRoute } from 'vue-router';
import { onMounted, computed } from 'vue';

const clientStore = useClientStore();
const route = useRoute();

const clientId = computed(() => route.params.id);


onMounted(() => {
  clientStore.getClient(clientId.value);
});

</script>

<template>
  <v-card
      v-if="clientStore.client"
      min-height="100%"
  >
    <div class="d-flex align-center justify-space-between pr-2">
      <div>
        <v-card-title>
          {{ clientStore.client.name }}
        </v-card-title>
        <v-card-subtitle>
          {{ clientStore.client.notes }}
        </v-card-subtitle>
      </div>
      <v-btn
          type="primary"
          prepend-icon="$plus"
          :to="{ name: 'add-workout', params: { id: clientId } }"
      >
        Добавить тренировку
      </v-btn>
    </div>
    <v-card-text>
      <v-empty-state
          icon="$warning"
          title="Нет назначенных тренировок для клиента"
      />
    </v-card-text>
  </v-card>
</template>
