<script setup lang="ts">
import { ref, watch, onMounted, defineProps, defineEmits } from 'vue';
import { useExercisesApi } from '@/shared/api';
import { Exercise as TypeExercise } from '@/shared/types';
import { Exercise } from "@/entities/exercise";
import { useExerciseManagementStore } from "@/feature/exercise-management";

const props = defineProps<{ filtersOpen: boolean }>();
const emits = defineEmits<{
  (e: 'toggleFilters'): void;
  (e: 'update:model-value', exercise: Map<string, TypeExercise>): void;
}>();

const exerciseApi = useExercisesApi();
const exerciseManagementStore = useExerciseManagementStore();
const exerciseMetaData = exerciseManagementStore.exerciseMetaData;

const searchQuery = ref('');
const selectedBodyParts = ref<string[]>([]);
const selectedEquipments = ref<string[]>([]);
const selectedTags = ref<string[]>([]);
const exercises = ref<TypeExercise[]>([]);
const selectedExercise = ref<Map<string, TypeExercise>>(new Map());

/** Фильтры для запроса */
const filterParams = ref({
  search: '',
  bodyParts: [],
  equipments: [],
  tags: [],
});

/** Запрос упражнений с фильтрами */
const fetchExercises = async () => {
  exercises.value = await exerciseApi.getExercises(filterParams.value);
};

/** Применение фильтров */
const applyFilters = () => {
  filterParams.value = {
    search: searchQuery.value,
    bodyParts: selectedBodyParts.value,
    equipments: selectedEquipments.value,
    tags: selectedTags.value,
  };
  fetchExercises();
  emits('toggleFilters');
};

/** Сброс фильтров */
const resetFilters = () => {
  searchQuery.value = '';
  selectedBodyParts.value = [];
  selectedEquipments.value = [];
  selectedTags.value = [];
  applyFilters();
};

const toggleExercise = (exercise: TypeExercise) => {
  if (selectedExercise.value.has(exercise._id as string)) {
    selectedExercise.value.delete(exercise._id as string);
  } else {
    selectedExercise.value.set(exercise._id as string, exercise);
  }

  emits('update:model-value', selectedExercise.value);
}

/** Следим за изменением поиска и автоматически обновляем список */
watch(searchQuery, () => {
  filterParams.value.search = searchQuery.value;
  fetchExercises();
});

onMounted(() => {
  Promise.all([
    fetchExercises(),
    exerciseManagementStore.fetchExerciseMetaData(),
  ]);
});
</script>

<template>
  <v-row class="mb-2 align-center justify-space-between">
    <v-col cols="9">
      <v-text-field
          v-model="searchQuery"
          label="Введите название упражнения"
          append-inner-icon="mdi-magnify"
          clearable
          hide-details
      />
    </v-col>
    <v-col cols="3" class="d-flex justify-end">
      <v-btn
          variant="outlined"
          color="primary"
          prepend-icon="mdi-filter"
          @click="emits('toggleFilters')"
      >
        Фильтры
      </v-btn>
    </v-col>
  </v-row>

  <v-expand-transition>
    <v-card v-if="props.filtersOpen" class="filter-panel pa-4" elevation="4">
      <v-row>
        <v-col cols="4">
          <v-combobox
              v-model="selectedBodyParts"
              :items="exerciseMetaData.bodyParts"
              label="Части тела"
              :multiple="true"
              :clearable="true"
              :chips="true"
              :closable-chips="true"
          />
        </v-col>
        <v-col cols="4">
          <v-combobox
              v-model="selectedEquipments"
              :items="exerciseMetaData.equipments"
              label="Оборудование"
              :multiple="true"
              :clearable="true"
              :chips="true"
              :closable-chips="true"
          />
        </v-col>
        <v-col cols="4">
          <v-combobox
              v-model="selectedTags"
              :items="exerciseMetaData.tags"
              label="Теги"
              :multiple="true"
              :clearable="true"
              :chips="true"
              :closable-chips="true"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-end">
          <v-btn variant="outlined" @click="resetFilters">Сбросить</v-btn>
          <v-btn color="primary" class="ml-2" @click="applyFilters">Применить</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-expand-transition>

  <div v-if="exercises.length"
       class="d-flex flex-wrap ga-2"
  >
    <exercise
        v-for="exercise in exercises"
        :key="exercise._id"
        :exercise="exercise"
        :selected="selectedExercise.has(exercise._id as string)"
        @click="() => toggleExercise(exercise)"
    />
  </div>
  <v-empty-state
    v-else
    icon="mdi-alert"
    headline="Упражнений не найдено"
  />
</template>

<style scoped>
/* Панель фильтров */
.filter-panel {
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 10px;
  padding: 16px;
  position: absolute;
  top: 11%;
  z-index: 3000;
}
</style>
