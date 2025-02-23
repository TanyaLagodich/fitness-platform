<script setup lang="ts">
import draggable from 'vuedraggable'
import {useExerciseManagementStore} from "@/feature/exercise-management/model";
import {ExerciseInWorkout, ExerciseTypes, ExerciseWithRepeats} from "@/shared/types";
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

const handleMoveExercise = () => {
  exerciseManagementStore.exercises = exerciseManagementStore.exercises.map((item: ExerciseWithRepeats | ExerciseInWorkout) => {
    if (!item.type) {
      return {
        type: ExerciseTypes.Single,
        exercises: [item],
      };
    }

    return {
      type: item.exercises.length > 1 ? ExerciseTypes.Superset : ExerciseTypes.Single,
      exercises: [...item.exercises],
    }
  })

  exerciseManagementStore.exercises = exerciseManagementStore.exercises.filter(group => group.exercises.length !== 0);
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
          :model-value="exerciseManagementStore.exercises"
          :list="exerciseManagementStore.exercises"
          item-key="id"
          group="exercise"
          handle=".drag-handle"
          @end="handleMoveExercise"
        >
          <template #item="{ element: group, index }">
            <v-card
                variant="elevated"
                class="exercise-card px-4 py-4 my-4"
            >
              <template #title>
                <h4>
                  <v-icon icon="mdi-drag" class="drag-handle" />
                  {{ index + 1 }}
                  {{ group.type === ExerciseTypes.Superset ? 'Супер-сет' : '' }}
                </h4>
              </template>
              <v-expansion-panels>
                <draggable
                    :model-value="group.exercises"
                    :list="group.exercises"
                    item-key="id"
                    class="w-100"
                    group="exercise"
                    handle=".drag-handle"
                    @end="handleMoveExercise"
                >
                  <template #item="{ element: exercise, index: exerciseIndex }">
                    <exercise-item
                        :exercise="exercise"
                        :index="exerciseIndex"
                        class="ga-2"
                        @delete="() => deleteExercise(group, exerciseIndex)"
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
<style lang="scss">
  .exercise-card {
    .drag-handle:hover {
      cursor: grab;
    }
  }
</style>
