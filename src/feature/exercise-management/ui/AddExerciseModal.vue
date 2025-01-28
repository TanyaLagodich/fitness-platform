<script setup lang="ts">
import { ref, watch } from 'vue';
import { Exercise, useExercisesStore } from "@/entities/exercise";
import type { Exercise as TypeExercise } from '@/shared/types';

defineProps<{ modelValue: boolean }>();
const emits = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void,
  (e: 'create-superset', exercises: TypeExercise[]): void,
  (e: 'save-exercises', exercises: TypeExercise[]): void,
}>();

const exercisesStore = useExercisesStore();

const searchExercise = ref<string>('');
const selectedBodyParts = ref<string | undefined>(undefined);
const exercises = ref(new Set());
const query = {
  limit: 10,
  offset: 0,
}

const fetchExercises = async (offset = query.offset) => {
    query.offset = offset;

    if (searchExercise.value) {
      selectedBodyParts.value = '';
      await exercisesStore.getExercisesByName(searchExercise.value, query);
    } else if (selectedBodyParts.value) {
      await exercisesStore.getExercisesByName(selectedBodyParts.value, query);
    } else {
      await exercisesStore.fetchExercises(query);
    }
};

watch(selectedBodyParts, () => {
  searchExercise.value = '';
  query.offset = 0;
  fetchExercises();
});

const saveExercises = (type: 'superset' | 'single'): void => {
  if (type === 'single') {
    emits('save-exercises', exercises.value);
  } else {
    emits('create-superset', exercises.value);
  }
  exercises.value.clear();
}

const loadMoreExercises = async ({ done }) => {
  try {
    done('loading');

    const prevExercisesLength = exercisesStore.exercises.length;
    const newOffset = query.offset + query.limit;
    await fetchExercises(newOffset);
    done(prevExercisesLength === exercisesStore.exercises.length ? 'empty' : 'ok');
  } catch {
    done('error');
  }
};
</script>

<template>
  <v-dialog
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card max-width="800" class="align-self-center">
      <div class="d-flex align-center justify-space-between px-4 py-4">
        <v-card-title>Упражнения</v-card-title>
        <v-btn icon="$plus" title="Создать упражнение" variant="outlined" color="secondary" />
      </div>
      <v-card-text>
        <v-text-field
            v-model="searchExercise"
            label="Введите название упражнение на английском"
            append-inner-icon="mdi-magnify"
            @update:model-value="fetchExercises"
        />

        <v-chip-group
            v-model="selectedBodyParts"
            selected-class="text-primary"
            :column="true"
        >
          <v-chip
              v-for="bodyPart in exercisesStore.bodyParts"
              :key="bodyPart"
              :text="bodyPart"
          />
        </v-chip-group>
        <v-infinite-scroll
          :height="400"
          color="primary"
          class="d-flex flex-row flex-wrap justify-center pb-2"
          @load="loadMoreExercises"
        >
          <template
              v-for="exercise in exercisesStore.exercises"
              :key="exercise.id"
          >
            <v-col
                class="d-flex child-flex"
                cols="4"
            >
              <exercise :exercise="exercise">
                <template #actions>
                  <!--                  <v-btn icon="$edit" />-->
                  <v-btn
                      :icon="exercises.has(exercise) ? '$delete' : '$plus'"
                      @click="exercises.has(exercise) ? exercises.delete(exercise) : exercises.add(exercise)"
                  />
                </template>
              </exercise>
            </v-col>
          </template>
        </v-infinite-scroll>
      </v-card-text>

      <v-card-actions
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
