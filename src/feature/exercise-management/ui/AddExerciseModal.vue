<script setup lang="ts">
import { ref, watch } from "vue";
import { Exercise, useExercisesStore } from "@/entities/exercise";
import type { Exercise as TypeExercise } from '@/shared/types';
import { debounce } from '@/shared/lib';

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
  limit: 20,
  offset: 0,
}

const fetchExercises = debounce((offset = query.offset) => {
  query.offset = offset;
  if (searchExercise.value) {
    selectedBodyParts.value = '';
    exercisesStore.getExercisesByName(searchExercise.value, query);
  } else if (selectedBodyParts.value) {
    exercisesStore.getExercisesByName(selectedBodyParts.value, query);
  } else {
    exercisesStore.fetchExercises(query);
  }
});

watch(selectedBodyParts, () => {
  searchExercise.value = '';
  query.offset = 0;
  fetchExercises();
});



const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  if (target.scrollTop + target.clientHeight >= target.scrollHeight - 100) {
    fetchExercises(query.offset + 1);
  }
}

const saveExercises = (type: 'superset' | 'single'): void => {
  if (type === 'single') {
    emits('save-exercises', exercises.value);
  } else {
    emits('create-superset', exercises.value);
  }
  exercises.value.clear();
}

</script>

<template>
  <v-dialog
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card max-width="800" class="align-self-center" @scroll="handleScroll">
      <div class="d-flex align-center justify-space-between px-4 py-4">
        <v-card-title>Упражнения</v-card-title>
        <v-btn icon="$plus" title="Создать упражнение" variant="outlined" color="secondary" />
      </div>
      <v-card-text>
        <v-text-field
            v-model="searchExercise"
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
        <v-row>
          <v-col
              v-for="exercise in exercisesStore.exercises"
              :key="exercise.id"
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
        </v-row>
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
