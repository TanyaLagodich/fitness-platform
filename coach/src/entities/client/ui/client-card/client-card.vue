<script setup lang="ts">
import type { Client } from '../../model';

defineProps<{ client: Client }>();
</script>

<template>
  <v-card :link="true" :hover="true" :to="{ name: 'client', params: { id: client._id } }">
    <v-card-title>
      <v-avatar v-if="client.photo">
        <v-img :alt="client.name" :src="client.photo" />
      </v-avatar>
      {{ client.name }}
    </v-card-title>
  </v-card>
</template>
