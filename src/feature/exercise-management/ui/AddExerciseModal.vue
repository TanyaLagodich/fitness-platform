<script setup lang="ts">
import { ref } from 'vue';
import type { Exercise, Exercise as TypeExercise } from '@/shared/types';
import { NewExercise } from '@/feature/exercise-management';
import { ExistedExercises } from '@/feature/exercise-management/ui/existed-exercises';

defineProps<{ modelValue: boolean }>();
const emits = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void;
  (e: 'create-superset', exercises: Map<string, Exercise>): void;
  (e: 'save-exercises', exercises: Map<string, Exercise>): void;
}>();

const filtersOpen = ref(false);

const tab = ref<'existed' | 'new'>('existed');

const exercises = ref<Map<string, Exercise>>(new Map());

const saveExercises = (type: 'superset' | 'single'): void => {
  if (type === 'single') {
    emits('save-exercises', exercises.value);
  } else {
    emits('create-superset', exercises.value);
  }
  exercises.value.clear();
};

const updateExistedExercises = () => {
  tab.value = 'existed';
};
</script>

<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <v-card max-width="800" min-width="800" class="align-self-center">
      <v-overlay v-model="filtersOpen" :contained="true" @click="filtersOpen = false" />
      <v-tabs v-model="tab" bg-color="primary">
        <v-tab value="existed">Выбрать из базы</v-tab>
        <v-tab value="new">Создать новое упражнение</v-tab>
      </v-tabs>

      <v-card-text>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="existed">
            <existed-exercises
              v-model="exercises"
              :filters-open="filtersOpen"
              @toggle-filters="filtersOpen = !filtersOpen"
            />
          </v-tabs-window-item>

          <v-tabs-window-item value="new">
            <new-exercise @go-to-existed-tab="updateExistedExercises" />
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>

      <v-card-actions
        v-if="exercises.size > 0"
        class="position-sticky bottom-0 bg-white border-t-md justify-center"
      >
        <v-btn
          v-if="exercises.size > 1"
          variant="outlined"
          color="primary"
          @click="saveExercises('superset')"
        >
          Создать суперсет
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :disabled="exercises.size === 0"
          @click="saveExercises('single')"
        >
          Установить ({{ exercises.size }})
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss">
.v-infinite-scroll__side {
  padding: 0;
}
</style>
