<script setup lang="ts">
import {ref, watch} from "vue";
import {Exercise, useExercisesStore} from "@/entities/exercise";

defineProps<{ modelValue: boolean }>();
defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void,
  (e: 'create-superset', exercises: Exercise[]): void,
  (e: 'save-exercises', exercises: Exercise[]): void,
}>();

const exercisesStore = useExercisesStore();

const searchExercise = ref<string>('');
const selectedBodyParts = ref<string | undefined>(undefined);
const exercises = ref(new Set());

const handleSearchExercises = (value) => {
  if (!value) {
    exercisesStore.fetchExercises({});
  } else {
    exercisesStore.getExercisesByName(value);
  }
}

watch(selectedBodyParts, (newValue: number | undefined) => {
  if (typeof newValue === 'undefined') {
    exercisesStore.fetchExercises({});
  } else {
    exercisesStore.getExercisesByBodyPart(exercisesStore.bodyParts[newValue]);
  }
});

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
            append-inner-icon="mdi-magnify"
            @update:model-value="handleSearchExercises"
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
            @click="$emit('create-superset', exercises)"
        >
          Создать суперсет
        </v-btn>
        <v-btn
            color="primary"
            variant="flat"
            :disabled="exercises.size === 0"
            @click="$emit('save-exercises', exercises)"
        >
          Установить ({{ exercises.size }})
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
