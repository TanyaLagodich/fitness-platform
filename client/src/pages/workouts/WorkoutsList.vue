<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchMyWorkouts } from '@/api/workouts';
import type { Workout } from '@/shared/types';

const router = useRouter();
const workouts = ref<Workout[]>([]);
const isLoading = ref(true);
const errorMessage = ref('');

const loadWorkouts = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    workouts.value = await fetchMyWorkouts();
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.error || 'Не удалось загрузить тренировки';
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (date?: string | Date) => {
  if (!date) return 'Дата не назначена';
  const value = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(value.getTime())) return 'Дата не назначена';
  return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' }).format(value);
};

const statusColor = (status?: string) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in-progress':
      return 'info';
    default:
      return 'grey';
  }
};

onMounted(loadWorkouts);
</script>

<template>
  <v-container class="py-6" fluid>
    <v-row justify="space-between" align="center" class="mb-4">
      <div>
        <h1 class="text-h5 mb-1">Назначенные тренировки</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">Все планы, которые подготовил ваш тренер</p>
      </div>
      <v-btn prepend-icon="mdi-refresh" variant="tonal" :loading="isLoading" @click="loadWorkouts">
        Обновить
      </v-btn>
    </v-row>

    <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4">
      {{ errorMessage }}
    </v-alert>

    <v-skeleton-loader v-if="isLoading" type="card, card, card" />

    <v-empty-state
      v-else-if="!workouts.length"
      icon="mdi-dumbbell"
      title="Тренировки пока не назначены"
      text="Когда тренер составит план, он появится здесь"
    />

    <v-row v-else dense>
      <v-col v-for="workout in workouts" :key="workout._id || workout.name" cols="12" md="6" lg="4">
        <v-card class="h-100" variant="outlined">
          <v-card-item>
            <div class="d-flex justify-space-between align-start ga-2">
              <div>
                <div class="text-subtitle-1 font-weight-medium">{{ workout.name }}</div>
                <div class="text-body-2 text-medium-emphasis">{{ formatDate(workout.date) }}</div>
              </div>
              <v-chip :color="statusColor(workout.status)" size="small" variant="tonal">
                {{ workout.status === 'completed' ? 'Завершено' : workout.status === 'in-progress' ? 'В процессе' : 'Запланировано' }}
              </v-chip>
            </div>
          </v-card-item>

          <v-card-text class="text-body-2 text-medium-emphasis">
            {{ workout.description || 'Описание не добавлено' }}
          </v-card-text>

          <v-card-actions class="pt-0">
            <v-btn color="primary" variant="flat" block @click="router.push({ name: 'workout-detail', params: { id: workout._id } })">
              Открыть
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
