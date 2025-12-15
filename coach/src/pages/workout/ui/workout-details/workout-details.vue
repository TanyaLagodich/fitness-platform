<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useWorkoutModel } from '@/feature/workout-management';
import { useClientModel } from '@/feature/client-management';
import type { Workout } from '@/entities/workout';
import type { ExerciseInWorkout, ExerciseWithRepeats } from '@/shared/types';

const route = useRoute();
const workoutModel = useWorkoutModel();
const clientModel = useClientModel();

const clientId = computed(() => route.params.id as string);
const workoutId = computed(() => route.params.workoutId as string);

const isLoading = ref(true);
const errorMessage = ref('');
const workout = ref<Workout | null>(null);
const currentWorkout = computed(() => workout.value ?? workoutModel.workout ?? null);

const getRepeatLabel = (exercise: ExerciseWithRepeats) => {
  const repeats = exercise.repeats?.length || 0;
  if (repeats === 0) return 'нет подходов';
  if (repeats === 1) return '1 подход';
  if (repeats >= 5) return `${repeats} подходов`;
  return `${repeats} подхода`;
};

const formatDate = (date?: Date | string) => {
  if (!date) return 'Не назначена';
  const normalizedDate = typeof date === 'string' ? new Date(date) : date;
  return Number.isNaN(normalizedDate.getTime())
    ? 'Не назначена'
    : normalizedDate.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
};

const loadWorkout = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';

    if (!workoutId.value) {
      errorMessage.value = 'Не указан идентификатор тренировки';
      return;
    }

    // Ensure client context is loaded for breadcrumbs / actions
    if (!workoutModel.client && clientId.value) {
      const client = await clientModel.getClientById(clientId.value);
      workoutModel.setClient(client);
    }

    await workoutModel.getWorkoutsForClient();
    workout.value = workoutModel.workout;
  } catch (error) {
    console.error(error);
    errorMessage.value = 'Не удалось загрузить тренировку';
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadWorkout);
</script>

<template>
  <v-card class="workout-details-card">
    <v-card-title class="d-flex justify-space-between align-center">
      <div>
        <div class="text-overline mb-1">Тренировка</div>
        <h2 class="text-h5 font-weight-medium mb-0">
          {{ currentWorkout?.name || 'Загрузка...' }}
        </h2>
        <p class="text-body-2 text-medium-emphasis mb-0" v-if="workout?.description">
          {{ currentWorkout?.description }}
        </p>
      </div>

      <div class="d-flex ga-2">
        <v-btn
          variant="tonal"
          prepend-icon="mdi-pencil"
          :disabled="!workout"
          @click="
            $router.push({
              name: 'workout-edit',
              params: { id: clientId, workoutId },
            })
          "
        >
          Редактировать
        </v-btn>
        <v-btn variant="outlined" prepend-icon="mdi-arrow-left" @click="$router.back()">
          Назад
        </v-btn>
      </div>
    </v-card-title>

    <v-divider />

    <v-card-text>
      <v-skeleton-loader
        v-if="isLoading"
        type="list-item-two-line, list-item-two-line, article"
        class="mt-4"
      />

      <v-alert v-else-if="errorMessage" type="error" variant="tonal" class="mt-4">
        {{ errorMessage }}
      </v-alert>

      <template v-else-if="workout">
        <v-row class="mb-6">
          <v-col cols="12" md="4">
            <v-sheet class="pa-4 rounded-lg border">
              <p class="text-caption text-medium-emphasis mb-1">Дата</p>
              <p class="text-body-1">{{ formatDate(currentWorkout?.date) }}</p>
            </v-sheet>
          </v-col>
          <v-col cols="12" md="4">
            <v-sheet class="pa-4 rounded-lg border">
              <p class="text-caption text-medium-emphasis mb-1">Периодичность</p>
              <p class="text-body-1">
                {{ currentWorkout?.frequency || 'Не выбрана' }}
              </p>
            </v-sheet>
          </v-col>
          <v-col cols="12" md="4">
            <v-sheet class="pa-4 rounded-lg border">
              <p class="text-caption text-medium-emphasis mb-1">Количество блоков</p>
              <p class="text-body-1">
                {{ currentWorkout?.groups?.length || 0 }}
              </p>
            </v-sheet>
          </v-col>
        </v-row>

        <div>
          <h3 class="text-h6 mb-4">Структура тренировки</h3>
          <v-empty-state
            v-if="!currentWorkout?.groups || !currentWorkout?.groups.length"
            icon="mdi-dumbbell"
            title="Нет упражнений"
            text="Добавьте упражнения, чтобы клиент мог приступить к тренировке"
          />

          <v-timeline v-else side="end" align="start" density="comfortable">
            <v-timeline-item
              v-for="(group, index) in (currentWorkout?.groups as ExerciseInWorkout[])"
              :key="index"
              :dot-color="group.type === 'Superset' ? 'primary' : 'secondary'"
              size="small"
            >
              <template #opposite>
                <v-chip density="comfortable" color="info" variant="tonal">
                  {{ group.type === 'Superset' ? 'Суперсет' : 'Упражнение' }}
                </v-chip>
              </template>

              <v-card elevation="1" class="pa-4">
                <p class="text-caption text-medium-emphasis mb-1">Блок {{ index + 1 }}</p>
                <h4 class="text-body-1 font-weight-medium">Список упражнений</h4>
                <v-divider class="my-3" />
                <v-list density="comfortable">
                  <v-list-item
                    v-for="exercise in group.exercises"
                    :key="exercise._id || exercise.name"
                    class="exercise-list-item"
                  >
                    <template #prepend>
                      <v-avatar
                        v-if="exercise.thumbnailUrl"
                        rounded="lg"
                        size="70"
                        class="me-4"
                      >
                        <v-img :src="exercise.thumbnailUrl" :alt="exercise.name" cover />
                      </v-avatar>
                      <v-avatar v-else color="primary" rounded="lg" size="70" class="me-4">
                        <v-icon icon="mdi-dumbbell" />
                      </v-avatar>
                    </template>

                    <div class="exercise-content w-100">
                      <div class="d-flex flex-wrap align-center justify-space-between ga-2">
                        <div>
                          <span class="font-weight-medium text-body-1">{{ exercise.name }}</span>
                          <div class="d-flex flex-wrap ga-2 mt-2" v-if="exercise.bodyParts?.length">
                            <v-chip
                              v-for="bodyPart in exercise.bodyParts"
                              :key="`body-${exercise._id}-${bodyPart}`"
                              size="x-small"
                              color="secondary"
                              label
                              variant="tonal"
                            >
                              {{ bodyPart }}
                            </v-chip>
                          </div>
                        </div>

                        <v-chip color="primary" variant="tonal" size="small">
                          {{ getRepeatLabel(exercise as ExerciseWithRepeats) }}
                        </v-chip>
                      </div>

                      <p class="text-medium-emphasis text-body-2 mt-2" v-if="exercise.description">
                        {{ exercise.description }}
                      </p>

                      <div class="meta-chips" v-if="exercise.tags?.length || exercise.equipments?.length">
                        <v-chip
                          v-for="equipment in exercise.equipments"
                          :key="`equipment-${exercise._id}-${equipment}`"
                          size="x-small"
                          color="info"
                          label
                          variant="outlined"
                        >
                          {{ equipment }}
                        </v-chip>
                        <v-chip
                          v-for="tag in exercise.tags"
                          :key="`tag-${exercise._id}-${tag}`"
                          size="x-small"
                          color="success"
                          label
                          variant="outlined"
                        >
                          {{ tag }}
                        </v-chip>
                      </div>

                      <div class="exercise-video mt-4" v-if="exercise.videoUrl">
                        <video
                          :poster="exercise.thumbnailUrl"
                          controls
                          playsinline
                          preload="metadata"
                        >
                          <source :src="exercise.videoUrl" type="video/mp4" />
                          Ваш браузер не поддерживает воспроизведение видео.
                        </video>
                      </div>
                    </div>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </div>
      </template>

      <v-empty-state
        v-else
        icon="mdi-alert-circle-outline"
        title="Тренировка не найдена"
        text="Попробуйте выбрать другую тренировку из списка клиента."
      />
    </v-card-text>
  </v-card>
</template>

<style scoped>
.workout-details-card {
  min-height: 80vh;
}

.exercise-list-item {
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  margin-bottom: 12px;
}

.exercise-content {
  padding: 12px 0;
}

.meta-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.exercise-video video {
  width: 100%;
  border-radius: 12px;
  display: block;
  background-color: #000;
}
</style>