<script setup lang="ts">
import {useExerciseManagementStore} from "@/feature/exercise-management/model";
import {ExerciseInWorkout} from "@/shared/types";
import ExerciseItem from "@/feature/exercise-management/ui/ExerciseItem.vue";

const exerciseManagementStore = useExerciseManagementStore();
const { deleteExercise } = exerciseManagementStore;

const addRepeatToExercise = (exercise: ExerciseInWorkout) => {
  if (exercise.repeats.length) {
    exercise.repeats.push(Object.assign({}, exercise.repeats[exercise.repeats.length - 1]));
  } else {
    exercise.repeats.push({
      count: 0,
      notes: '',
      rpe: 0,
    });
  }
}

const deleteRepeatFromExercise = (exercise: ExerciseInWorkout, index: number) => {
  exercise.repeats.splice(index, 1);
}
</script>

<template>
  <v-card>
    <div class="d-flex align-center">
      <v-card-title>Список упражнений</v-card-title>
      <slot name="actions" />
    </div>
    <v-card-text>
      <v-empty-state
          v-if="!exerciseManagementStore.exercises.length"
          text="Нет добавленных упражнений"
      />
      <template v-else>
        <v-card
          v-for="(group, index) in exerciseManagementStore.exercises"
          :key="index"
          variant="elevated"
          class="px-4 py-4 my-4"
        >
          <template #title>
            <h4>
              {{ index + 1 }}
              {{ group.type === 'superset' ? 'Супер-сет' : '' }}
            </h4>
          </template>
          <v-expansion-panels>
            <exercise-item
                v-for="(exercise, index) in group.exercises"
                :key="exercise.id"
                :exercise="exercise"
                :index="index"
                class="ga-2"
                @delete="() => deleteExercise(exercise, index)"
                @delete-repeat="(repeatIndex) => deleteRepeatFromExercise(exercise, repeatIndex)"
                @add-repeat="() => addRepeatToExercise(exercise)"
            />
          </v-expansion-panels>
        </v-card>
      </template>
    </v-card-text>
  </v-card>
</template>
