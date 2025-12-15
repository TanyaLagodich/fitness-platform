<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { VDateInput } from 'vuetify/labs/VDateInput';
import { AddExerciseModal } from '@/feature/exercise-management';
import { useWorkoutModel } from '../../model';
import { Exercise } from '@/shared/types';
import type { Client } from '@/entities/client';
import { ExerciseList } from '../exercise-list';
import { useClientModel } from '@/feature/client-management';

const route = useRoute();
const router = useRouter();
const workoutModel = useWorkoutModel();
const clientModel = useClientModel();
const { addSuperset, addExercises, saveWorkout, updateWorkout, getWorkoutById } = workoutModel;
const isAddExerciseModalShown = ref<boolean>(false);
const isSaving = ref<boolean>(false);

const clientId = computed(() => {
  const id = route.params.id;
  return Array.isArray(id) ? id[0] : (id as string | undefined);
});
const isEditMode = computed(() => Boolean(route.params.workoutId));
const pageTitle = computed(() => (isEditMode.value ? 'Редактировать тренировку' : 'Новая тренировка'));
const selectedClientId = ref<string | undefined>();
const selectedClient = computed<Client | null>(() => {
  return (
    clientModel.clients.find((client) => client._id === selectedClientId.value) ||
    workoutModel.client ||
    null
  );
});

const saveExercises = (exercises: Map<string, Exercise>) => {
  addExercises(exercises);
  isAddExerciseModalShown.value = false;
};

const createSuperset = (exercises: Map<string, Exercise>) => {
  addSuperset(exercises);
  isAddExerciseModalShown.value = false;
};

onMounted(async () => {
  await clientModel.getAllClients();

  const workoutId = Array.isArray(route.params.workoutId)
    ? route.params.workoutId[0]
    : (route.params.workoutId as string | undefined);

  if (isEditMode.value && workoutId) {
    await getWorkoutById(workoutId);
  }

  const initialClientId = workoutModel.workout.clientId ?? clientId.value;
  if (initialClientId) {
    selectedClientId.value = initialClientId;
    const client =
      clientModel.clients.find((item) => item._id === initialClientId) ??
      (await clientModel.getClientById(initialClientId));
    if (client) {
      workoutModel.setClient(client);
    }
  }
});

const handleSave = async () => {
  try {
    isSaving.value = true;
    if (isEditMode.value) {
      await updateWorkout();
    } else {
      await saveWorkout();
    }
    const targetId = selectedClientId.value ?? clientId.value;
    router.push({ name: 'client', params: { id: targetId } });
  } catch (error) {
    console.error(error);
  } finally {
    isSaving.value = false;
  }
};

const goBack = () => {
  if (clientId.value) {
    router.push({ name: 'client', params: { id: clientId.value } });
  } else {
    router.back();
  }
};

const handleClientChange = async (id: string | null) => {
  if (!id) return;
  selectedClientId.value = id;
  const client =
    clientModel.clients.find((item) => item._id === id) ?? (await clientModel.getClientById(id));
  if (client) {
    workoutModel.setClient(client);
    const targetRoute = isEditMode.value
      ? { name: 'workout-edit', params: { id, workoutId: route.params.workoutId } }
      : { name: 'workout', params: { id } };
    router.replace(targetRoute);
  }
};
</script>

<template>
  <v-card v-if="workoutModel.client">
    <v-card-text>
      <div class="d-flex align-center justify-space-between mb-4">
        <div class="d-flex align-center ga-2">
          <v-btn icon="mdi-arrow-left" variant="text" @click="goBack" />
          <div class="text-h6 font-weight-medium">{{ pageTitle }}</div>
        </div>
        <v-chip v-if="isEditMode" color="primary" variant="tonal" size="small">Редактирование</v-chip>
      </div>
      <p>Назначить для:</p>
      <div class="d-flex align-center ga-3 mt-2">
        <v-avatar color="info">
          <v-icon icon="mdi-account-circle" />
        </v-avatar>
        <div class="d-flex align-center flex-grow-1 ga-2">
          <div class="flex-grow-1">
            <div class="text-subtitle-1 font-weight-medium">
              {{ selectedClient?.name || 'Клиент не выбран' }}
            </div>
            <div class="text-body-2 text-medium-emphasis">
              {{ selectedClient?.email || 'Выберите клиента для назначения' }}
            </div>
          </div>
          <v-menu transition="fade-transition">
            <template #activator="{ props }">
              <v-btn icon="$edit" size="small" v-bind="props" />
            </template>
            <v-list>
              <v-list-subheader>Сменить клиента</v-list-subheader>
              <v-list-item
                v-for="client in clientModel.clients"
                :key="client._id"
                :value="client._id"
                @click="handleClientChange(client._id || null)"
              >
                <v-list-item-title>{{ client.name }}</v-list-item-title>
                <v-list-item-subtitle v-if="client.email">{{ client.email }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>

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

      <v-textarea v-model="workoutModel.workout.description" label="Описание (по желанию)" class="mt-4" />

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
    :loading="isSaving"
    @click="handleSave"
  />
</template>
