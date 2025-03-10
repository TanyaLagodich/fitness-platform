<script lang="ts" setup>
import { ref } from 'vue';
import { Exercise } from '@/shared/types';
import { ExerciseInfoSheet } from '@/entities/exercise';

defineProps<{
  exercise: Exercise;
  selected: boolean;
}>();

const showExerciseInformation = ref<boolean>(false);
const exerciseInformation = ref<Exercise | null>(null);

const openBottomSheet = (exercise: Exercise) => {
  showExerciseInformation.value = true;
  exerciseInformation.value = exercise;
};

const closeBottomSheet = () => {
  showExerciseInformation.value = false;
  exerciseInformation.value = null;
};
</script>

<template>
  <v-card
    class="mx-auto"
    max-width="344"
    :hover="true"
    width="100%"
    color="primary"
    :variant="selected ? 'tonal' : 'outlined'"
  >
    <v-card-text class="text-h6">
      <div class="d-flex align-center justify-space-between text-truncate">
        {{ exercise.name }}
        <v-icon v-show="selected" icon="mdi-check-circle" size="20" />
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
    <v-card-actions class="justify-end">
      <v-btn
        :icon="selected ? 'mdi-close-circle' : 'mdi-check-circle'"
        variant="outlined"
        :color="selected ? 'red' : 'primary'"
        @click="$emit('toggle-exercise', exercise)"
      />
      <v-btn
        icon="mdi-information"
        variant="outlined"
        color="secondary"
        @click="() => openBottomSheet(exercise)"
      />
    </v-card-actions>
  </v-card>

  <exercise-info-sheet
    :model-value="showExerciseInformation"
    :exercise="exerciseInformation"
    @update:model-value="closeBottomSheet"
  />
</template>
