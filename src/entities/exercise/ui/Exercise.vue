<script lang="ts" setup>
import { Exercise } from "@/shared/types";

defineProps<{ exercise: Exercise }>();

</script>

<template>
  <v-card
      class="mx-auto"
      max-width="344"
      :hover="true"
      width="100%"
  >
    <v-card-text
      class="text-h6"
    >
      {{ exercise.name }}
    </v-card-text>
    <v-img
        height="200px"
        :src="exercise.gifUrl"
    />

    <v-card-actions class="justify-end">
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>
