<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {Exercise} from "@/shared/types";
import { useExercisesApi } from '@/shared/api';
import {useExerciseManagementStore} from "@/feature/exercise-management";

const exerciseApi = useExercisesApi();
const exerciseManagementStore = useExerciseManagementStore();
const exerciseMetaData = exerciseManagementStore.exerciseMetaData;

const newExercise = ref<Exercise>({
  name: '',
  description: '',
  bodyParts: [],
  equipments: [],
  tags: [],
  videoUrl: '',
});

const emits = defineEmits<
    (e: 'go-to-existed-tab') => void
>();

const clearExercise = () => {
  newExercise.value = {
    name: '',
    description: '',
    bodyParts: [],
    equipments: [],
    tags: [],
    videoUrl: '',
  };
}

const createExercise = async () => {
  try {
    await exerciseApi.createExercise(newExercise.value);
    clearExercise();
    emits('go-to-existed-tab');
  } catch (err) {
    console.error(err);
  }

}

onMounted(exerciseManagementStore.fetchExerciseMetaData);
</script>

<template>
  <div></div>

  <v-text-field
      v-model="newExercise.name"
      label="Название"
  />

  <v-text-field
      v-model="newExercise.description"
      label="Описание (опционально)"
  />

  <v-combobox
    v-model="newExercise.bodyParts"
    label="Части тела"
    :items="exerciseMetaData.bodyParts"
    :multiple="true"
    :clearable="true"
    :chips="true"
    :closable-chips="true"
  />

  <v-combobox
      v-model="newExercise.equipments"
      label="Оборудование"
      :items="exerciseMetaData.equipments"
      :multiple="true"
      :clearable="true"
      :chips="true"
      :closable-chips="true"
  />
  <v-combobox
      v-model="newExercise.tags"
      label="Теги"
      :items="exerciseMetaData.tags"
      :multiple="true"
      :clearable="true"
      :chips="true"
      :closable-chips="true"
  />
  <v-text-field
      v-model="newExercise.videoUrl"
    label="Ссылка на видео"
  />

  <div class="d-flex align-center ga-2">
    <v-btn
        color="success"
        @click="createExercise"
    >
      Сохранить
    </v-btn>
    <v-btn color="error">Отмена</v-btn>
  </div>
</template>