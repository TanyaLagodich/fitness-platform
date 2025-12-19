<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { fetchWorkoutById, updateWorkoutProgress, uploadWorkoutVideo } from '@/api/workouts';
import type { Workout, WorkoutStatus, Exercise, Repeat } from '@/shared/types';

const route = useRoute();
const workoutId = computed(() => route.params.id as string);

const workout = ref<Workout | null>(null);
const isLoading = ref(true);
const isSaving = ref(false);
const videoUploading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const note = ref('');
const status = ref<WorkoutStatus>('planned');

const loadWorkout = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const data = await fetchWorkoutById(workoutId.value);
    workout.value = data;
    status.value = (data.status as WorkoutStatus) || 'planned';
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.error || 'Не удалось загрузить тренировку';
  } finally {
    isLoading.value = false;
  }
};

const saveProgress = async () => {
  if (!workoutId.value) return;
  isSaving.value = true;
  successMessage.value = '';
  errorMessage.value = '';
  try {
    const updated = await updateWorkoutProgress(workoutId.value, {
      status: status.value,
      note: note.value || undefined,
    });
    workout.value = updated;
    note.value = '';
    successMessage.value = 'Прогресс сохранен';
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.error || 'Не удалось сохранить прогресс';
  } finally {
    isSaving.value = false;
  }
};

const uploadVideo = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (!files?.length) return;
  const file = files[0];
  videoUploading.value = true;
  successMessage.value = '';
  errorMessage.value = '';
  try {
    const { url, workout: updated } = await uploadWorkoutVideo(workoutId.value, file);
    workout.value = updated ?? workout.value;
    successMessage.value = 'Видео загружено';
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.error || 'Не удалось загрузить видео';
  } finally {
    videoUploading.value = false;
    (event.target as HTMLInputElement).value = '';
  }
};

const formatRepeat = (repeat: Repeat) => {
  const parts: string[] = [];
  if (repeat.count) parts.push(`${repeat.count} повтор`);
  if (repeat.time) parts.push(repeat.time);
  if (repeat.weight) parts.push(`${repeat.weight} кг`);
  if (repeat.distance) parts.push(`${repeat.distance} м`);
  return parts.join(' • ') || 'Подход';
};

const videoUrl = computed(() => {
  if (!workout.value?.progressVideoUrl) return '';
  if (workout.value.progressVideoUrl.startsWith('http')) return workout.value.progressVideoUrl;
  return `http://localhost:4000${workout.value.progressVideoUrl}`;
});

onMounted(loadWorkout);
</script>

<template>
  <v-container class="py-6" fluid>
    <v-btn variant="text" prepend-icon="mdi-arrow-left" class="mb-4" @click="$router.back()">Назад</v-btn>

    <v-skeleton-loader v-if="isLoading" type="article, list-item-two-line" />

    <v-alert v-else-if="errorMessage" type="error" variant="tonal" class="mb-4">
      {{ errorMessage }}
    </v-alert>

    <template v-else-if="workout">
      <v-row class="mb-4" align="start" justify="space-between" >
        <v-col cols="12" md="8">
          <h2 class="text-h5 mb-1">{{ workout.name }}</h2>
          <p class="text-body-2 text-medium-emphasis mb-0">{{ workout.description || 'Описание не добавлено' }}</p>
        </v-col>
        <v-col cols="12" md="4" class="d-flex justify-end align-start">
          <v-chip color="primary" variant="tonal" size="large">
            {{ workout.status === 'completed' ? 'Завершено' : workout.status === 'in-progress' ? 'В процессе' : 'Запланировано' }}
          </v-chip>
        </v-col>
      </v-row>

      <v-row class="mb-4" dense>
        <v-col cols="12" md="4">
          <v-sheet class="pa-4" rounded="lg">
            <p class="text-caption text-medium-emphasis mb-1">Дата</p>
            <p class="text-body-1">{{ workout.date ? new Date(workout.date).toLocaleDateString('ru-RU') : 'Не назначена' }}</p>
          </v-sheet>
        </v-col>
        <v-col cols="12" md="4">
          <v-sheet class="pa-4" rounded="lg">
            <p class="text-caption text-medium-emphasis mb-1">Периодичность</p>
            <p class="text-body-1">{{ workout.frequency || 'Не указана' }}</p>
          </v-sheet>
        </v-col>
        <v-col cols="12" md="4">
          <v-sheet class="pa-4" rounded="lg">
            <p class="text-caption text-medium-emphasis mb-1">Блоков</p>
            <p class="text-body-1">{{ workout.groups?.length || 0 }}</p>
          </v-sheet>
        </v-col>
      </v-row>

      <v-card class="mb-6" variant="outlined">
        <v-card-title>Отметить прогресс</v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="4">
              <v-select
                v-model="status"
                label="Статус"
                :items="[
                  { title: 'Запланировано', value: 'planned' },
                  { title: 'В процессе', value: 'in-progress' },
                  { title: 'Завершено', value: 'completed' },
                ]"
              />
            </v-col>
            <v-col cols="12" md="8">
              <v-textarea v-model="note" label="Как прошла тренировка" auto-grow rows="2" />
            </v-col>
          </v-row>

          <div class="d-flex flex-wrap ga-4 align-center">
            <v-btn color="primary" :loading="isSaving" prepend-icon="mdi-content-save" @click="saveProgress">
              Сохранить
            </v-btn>
            <v-file-input
              label="Загрузить видео"
              accept="video/*"
              prepend-icon="mdi-video"
              :loading="videoUploading"
              @change="uploadVideo"
              show-size
              hide-details
            />
          </div>

          <v-alert v-if="successMessage" type="success" variant="tonal" class="mt-3">
            {{ successMessage }}
          </v-alert>
          <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-3">
            {{ errorMessage }}
          </v-alert>
        </v-card-text>
      </v-card>

      <v-card class="mb-6" variant="outlined">
        <v-card-title class="d-flex align-center justify-space-between">
          <span>Структура тренировки</span>
          <v-chip color="info" variant="tonal">{{ workout.groups?.length || 0 }} блоков</v-chip>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-empty-state
            v-if="!workout.groups || !workout.groups.length"
            icon="mdi-dumbbell"
            title="Нет упражнений"
            text="Как только тренер добавит упражнения, они появятся здесь"
          />
          <v-timeline v-else side="end" density="compact" align="start">
            <v-timeline-item v-for="(group, index) in workout.groups" :key="index" :dot-color="group.type === 'Superset' ? 'primary' : 'secondary'">
              <template #opposite>
                <v-chip size="small" color="info" variant="tonal">{{ group.type === 'Superset' ? 'Суперсет' : 'Упражнение' }}</v-chip>
              </template>

              <v-card elevation="1" class="pa-4">
                <p class="text-caption text-medium-emphasis mb-2">Блок {{ index + 1 }}</p>
                <v-list density="comfortable">
                  <v-list-item v-for="exercise in group.exercises" :key="exercise._id || exercise.name">
                    <div class="d-flex flex-column w-100">
                      <div class="d-flex justify-space-between align-center mb-1">
                        <div>
                          <div class="text-subtitle-2">{{ (exercise as Exercise).name }}</div>
                          <div class="text-caption text-medium-emphasis" v-if="(exercise as Exercise).description">{{ (exercise as Exercise).description }}</div>
                        </div>
                        <v-chip size="x-small" color="primary" variant="tonal">
                          {{ (exercise.repeats?.length || 0) }} подходов
                        </v-chip>
                      </div>
                      <div class="d-flex flex-wrap ga-2" v-if="exercise.repeats?.length">
                        <v-chip v-for="(repeat, idx) in exercise.repeats" :key="idx" size="x-small" color="secondary" variant="outlined">
                          {{ formatRepeat(repeat as Repeat) }}
                        </v-chip>
                      </div>
                    </div>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
      </v-card>

      <v-card v-if="videoUrl" variant="outlined">
        <v-card-title>Видеоотчет</v-card-title>
        <v-card-text>
          <video :src="videoUrl" controls style="width: 100%; border-radius: 12px; background: #000" />
        </v-card-text>
      </v-card>
    </template>
  </v-container>
</template>
