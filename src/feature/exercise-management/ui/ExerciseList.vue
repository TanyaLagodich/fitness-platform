<script setup lang="ts">
import draggable from 'vuedraggable'
import {useExerciseManagementStore} from "@/feature/exercise-management/model";
import {ExerciseInWorkout, ExerciseWithRepeats} from "@/shared/types";
import ExerciseItem from "@/feature/exercise-management/ui/ExerciseItem.vue";

const exerciseManagementStore = useExerciseManagementStore();
const { deleteExercise } = exerciseManagementStore;

const addRepeatToExercise = (exercise: ExerciseWithRepeats) => {
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

const deleteRepeatFromExercise = (exercise: ExerciseWithRepeats, index: number) => {
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
        <draggable
          v-model="exerciseManagementStore.exercises"
          item-key="id"
        >
          <template #item="{ element: group, index }">
            <v-card
                variant="elevated"
                class="exercise-card px-4 py-4 my-4"
            >
              <template #title>
                <h4>
                  {{ index + 1 }}
                  {{ group.type === 'superset' ? 'Супер-сет' : '' }}
                </h4>
              </template>
              <v-expansion-panels>
                <draggable
                    v-model="group.exercises"
                    item-key="id"
                    class="w-100"
                >
                  <template #item="{ element: exercise, index: exerciseIndex }">
                    <exercise-item
                        :exercise="exercise"
                        :index="exerciseIndex"
                        class="ga-2"
                        @delete="() => deleteExercise(exercise, exerciseIndex)"
                        @delete-repeat="(repeatIndex) => deleteRepeatFromExercise(exercise, repeatIndex)"
                        @add-repeat="() => addRepeatToExercise(exercise)"
                    />
                  </template>
                </draggable>
              </v-expansion-panels>
            </v-card>
          </template>
        </draggable>
      </template>
    </v-card-text>
  </v-card>
</template>
<style scoped lang="scss">
  .exercise-card {
    transition: all 0.3s ease-in-out;

    &.dragging {
      opacity: 0.5;
      transform: scale(0.95);
    }
  }

  .placeholder {
    height: 60px;
    background-color: rgb(var(--v-theme-blue-grey));
    border: 2px dashed rgb(var(--v-theme-primary));
    border-radius: 4px;
    margin-bottom: 10px;
  }
</style>
