<script lang="ts" setup>
import { Exercise } from "@/shared/types";

defineProps<{
  exercise: Exercise;
  selected: boolean;
}>();

</script>

<template>
  <v-card
      class="mx-auto"
      max-width="344"
      :hover="true"
      width="100%"
      color="primary"
      :variant="selected ? 'flat' : 'outlined'"
  >
    <v-card-text
      class="text-h6"
    >
      <div class="d-flex align-center justify-space-between ">
        {{ exercise.name }}
        <v-icon
            v-show="selected"
            icon="mdi-check-circle"
            size="20"
        />
      </div>
      <div>
        <img
            :src="exercise.thumbnailUrl"
            :alt="exercise.description || exercise.name"
            aspect-ratio="1/1"
            width="100%"
            height="100%"
        />
      </div>
    </v-card-text>
  </v-card>
</template>
