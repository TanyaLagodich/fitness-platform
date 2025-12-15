<script setup lang="ts">
import { computed } from 'vue';
import type { Client } from '../../model';

const props = defineProps<{ client: Client }>();

const initials = computed(() => props.client.name?.charAt(0)?.toUpperCase() ?? '?');
</script>

<template>
  <v-card
    class="client-card h-100"
    :link="true"
    :hover="true"
    variant="outlined"
    :to="{ name: 'client', params: { id: client._id } }"
  >
    <v-card-item>
      <div class="d-flex align-start ga-3">
        <v-avatar size="44" color="primary">
          <v-img v-if="client.photo" :alt="client.name" :src="client.photo" cover />
          <span v-else class="text-button text-white">{{ initials }}</span>
        </v-avatar>
        <div class="flex-grow-1">
          <div class="text-subtitle-1 font-weight-medium">{{ client.name }}</div>
          <div class="text-body-2 text-medium-emphasis">{{ client.email }}</div>
          <div class="text-body-2 text-truncate text-medium-emphasis mt-1" v-if="client.notes">
            {{ client.notes }}
          </div>
        </div>
        <v-icon icon="mdi-chevron-right" color="grey" />
      </div>
    </v-card-item>
  </v-card>
</template>

<style scoped>
.client-card {
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.client-card:hover {
  transform: translateY(-2px);
}
</style>
