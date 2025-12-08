<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { AddExerciseModal } from '@/feature/exercise-management';
import { useWorkoutModel } from '../../model';
import { Exercise } from '@/shared/types';
import { ExerciseList } from '../exercise-list';
import { VDateInput } from 'vuetify/labs/VDateInput';
import { useRoute } from 'vue-router';
import { useClientModel } from '@/feature/client-management';

const route = useRoute();
const workoutModel = useWorkoutModel();
const clientModel = useClientModel();
const { addSuperset, addExercises, saveWorkout } = workoutModel;
const isAddExerciseModalShown = ref<boolean>(false);

const saveExercises = (exercises: Map<string, Exercise>) => {
  addExercises(exercises);
  isAddExerciseModalShown.value = false;
};

const createSuperset = (exercises: Map<string, Exercise>) => {
  addSuperset(exercises);
  isAddExerciseModalShown.value = false;
};

onMounted(async () => {
  if (route.params.id && !workoutModel.workout.clientId) {
    const client = await clientModel.getClientById(route.params.id);
    console.log(client);
    workoutModel.setClient(client.value);
  }
});
</script>

<template>
  <v-card v-if="workoutModel.client">
    <v-card-text>
      <p>Назначить для:</p>
      <v-tooltip :text="workoutModel.client.name" location="bottom">
        <template v-slot:activator="{ props }">
          <v-avatar color="info" v-bind="props">
            <v-icon icon="mdi-account-circle" />
          </v-avatar>
        </template>
      </v-tooltip>
      <v-btn icon="$edit" class="ml-2" />

      <v-row class="mt-4">
        <v-col cols="6">
          <v-text-field v-model="workoutModel.workout.name" label="Название тренировки" />
        </v-col>

        <v-col cols="3">
          <v-select
            v-model="workoutModel.workout.frequency"
            label="Периодичность"
            :items="[
              'Не повторять',
              'Каждый день',
              'Каждую неделю',
              'Каждые две недели',
              'Каждый месяц',
            ]"
          />
        </v-col>

        <v-col cols="3">
          <v-date-input v-model="workoutModel.workout.date" label="Дата" />
        </v-col>
      </v-row>

      <v-textarea label="Описание (по желанию)" class="mt-4" />

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
    v-show="workoutModel.workout.groups.length"
    icon="mdi-content-save-outline"
    color="primary"
    class="fab-save"
    :absolute="true"
    @click="saveWorkout"
  />
</template>
