/* eslint-disable vue/no-mutating-props */
<script setup lang="ts">
import { ref } from 'vue';
import type { ExerciseWithRepeats } from '@/shared/types';
import { rpeItems } from '../conts.ts';
defineProps<{
  exercise: ExerciseWithRepeats;
  index: number;
}>();

defineEmits<{
  (e: 'delete'): void;
  (e: 'add-repeat'): void;
  (e: 'delete-repeat', index: number): void;
}>();

const counts = ref<boolean>(true);
const weights = ref<boolean>(false);
const distance = ref<boolean>(false);
const time = ref<boolean>(false);
</script>

<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-expansion-panel :id="exercise._id">
    <template #title>
      <v-row class="align-center">
        <v-icon icon="mdi-drag" class="drag-handle" />
        <h4>{{ index + 1 }}</h4>
        <v-col cols="1">
          <v-img :src="exercise.thumbnailUrl" />
        </v-col>
        <v-col>
          <h3>{{ exercise.name }}</h3>
          <p>{{ exercise.repeats.length }} подходов</p>
        </v-col>
        <v-col class="flex-grow-0">
          <v-btn icon="$delete" class="mr-4" variant="text" @click.stop="$emit('delete')" />
        </v-col>
      </v-row>
    </template>

    <template #text>
      <div class="d-flex align-center ga-2">
        <v-checkbox v-model="counts" label="Повторения" />
        <v-checkbox v-model="time" label="Время" />
        <v-checkbox v-model="weights" label="Вес" />
        <v-checkbox v-model="distance" label="Расстояние" />
      </div>
      <div class="d-flex flex-column ga-2">
        <v-card
          v-for="(repeat, repeatIndex) in exercise.repeats"
          :key="repeatIndex"
          class="pa-3"
        >
          <div class="d-flex align-center flex-wrap ga-3">
            <h5 class="mr-2">{{ repeatIndex + 1 }}</h5>
            <v-text-field
              v-if="counts"
              v-model="repeat.count"
              label="Повторения"
              type="number"
              class="flex-grow-1"
              :min="0"
              :hide-details="true"
              @click.stop
            />
            <v-text-field
              v-if="time"
              v-model="repeat.time"
              type="time"
              label="Время"
              class="flex-grow-1"
              :hide-details="true"
              @click.stop
            />
            <v-text-field
              v-if="weights"
              v-model="repeat.weight"
              type="number"
              class="flex-grow-1"
              label="Вес (кг)"
              :min="0"
              :hide-details="true"
              @click.stop
            />
            <v-text-field
              v-if="distance"
              v-model="repeat.distance"
              type="number"
              class="flex-grow-1"
              label="Расстояние (м)"
              :min="0"
              :hide-details="true"
              @click.stop
            />
            <v-select
              v-model="repeat.rpe"
              label="RPE"
              :items="rpeItems"
              :hide-details="true"
              class="flex-grow-0"
              style="min-width: 100px"
              @click.stop
            />

            <v-btn
              icon="$delete"
              class="ml-auto"
              variant="text"
              @click.stop="$emit('delete-repeat', repeatIndex)"
            />
          </div>
        </v-card>
      </div>
      <v-textarea
        v-model="exercise.notes"
        label="Комментарий к упражнению"
        class="mt-4"
        :hide-details="true"
      />
      <v-btn class="mt-4" @click="$emit('add-repeat')"> Добавить подход </v-btn>
    </template>
  </v-expansion-panel>
</template>
