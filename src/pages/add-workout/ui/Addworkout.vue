<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import { VDateInput } from 'vuetify/labs/VDateInput';
import { useClientStore } from '@/entities/client';
import {AddExerciseModal, ExerciseList, useExerciseManagementStore} from "@/feature/exercise-management";
import { Exercise, type Workout } from '@/shared/types';
import {useWorkoutsApi} from "@/shared/api/workouts";

const clientStore = useClientStore();
const exerciseManagementStore = useExerciseManagementStore();

const route = useRoute();
const clientId = computed<string>(() => route.params.id);

const workout = ref<Workout>({
  name: '',
  trainerId: '1',
  exercises: exerciseManagementStore.exercises,
});

const isAddExerciseModalShown = ref<boolean>(false);

onMounted(() => {
  if (clientStore.client?._id !== clientId.value) {
    clientStore.getClient(clientId.value);
  }
});

const saveExercises = (exercises: Map<string, Exercise>) => {
  exerciseManagementStore.addExercises(exercises);
  isAddExerciseModalShown.value = false;
}

const createSuperset = (exercises: Map<string, Exercise>) => {
  exerciseManagementStore.addSuperset(exercises);
  isAddExerciseModalShown.value = false;
}

const saveWorkout = async () => {
  const workoutApi = useWorkoutsApi();
  workoutApi.saveWorkout(workout.value);
}
</script>

<template>
  <v-card v-if="clientStore.client">
    <v-card-text>
      <p>Назначить для:</p>
      <v-tooltip
          :text="clientStore.client.name"
          location="bottom"
      >
        <template v-slot:activator="{ props }">
          <v-avatar
              color="info"
              v-bind="props"
          >
            <v-icon icon="mdi-account-circle" />
          </v-avatar>
        </template>
      </v-tooltip>
      <v-btn icon="$edit" class="ml-2" />

      <v-row class="mt-4">
        <v-col cols="6">
          <v-text-field
              label="Название тренировки"
          />
        </v-col>

        <v-col cols="3">
          <v-select
              label="Периодичность"
              :items="['Не повторять', 'Каждый день', 'Каждую неделю', 'Каждые две недели', 'Каждый месяц']"
          />
        </v-col>

        <v-col cols="3">
          <v-date-input
              v-model="workout.date"
              label="Дата"
          />
        </v-col>
      </v-row>

      <v-textarea
        label="Описание (по желанию)"
        class="mt-4"
      />

      <exercise-list>
        <template #actions>
          <v-btn
              prepend-icon="$plus"
              variant="outlined"
              size="small"
              @click="isAddExerciseModalShown = true"
          >
            Добавить упражнение
          </v-btn>
        </template>
      </exercise-list>
    </v-card-text>

    <AddExerciseModal
      v-model:model-value="isAddExerciseModalShown"
      @create-superset="createSuperset"
      @save-exercises="saveExercises"
    />
  </v-card>
  <v-fab
      v-show="exerciseManagementStore.exercises.length"
      icon="mdi-content-save-outline"
      color="primary"
      class="fab-save"
      :absolute="true"
      @click="saveExercises"
  />
</template>

<style lang="scss" scoped>
.fab-save {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 1100;
}
</style>
