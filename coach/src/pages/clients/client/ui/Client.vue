<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Client } from '@/entities/client';
import type { Workout } from '@/entities/workout/model';
import { useClientModel } from '@/feature/client-management';
import { useWorkoutModel } from '@/feature/workout-management';

defineOptions({
  name: 'ClientPage',
});

const clientModel = useClientModel();
const workoutModel = useWorkoutModel();
const route = useRoute();
const router = useRouter();

const clientId = computed<string>(() => String(route.params.id));
const client = ref<Client | null>(null);
const workouts = ref<Workout[]>([]);
const isLoading = ref<boolean>(true);
const error = ref<string>('');

const clientInitial = computed(() => client.value?.name?.charAt(0)?.toUpperCase() ?? '?');
const hasWorkouts = computed(() => workouts.value.length > 0);

const formatDate = (date?: Date | string) => {
  if (!date) return 'Дата не указана';
  const value = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(value.getTime())) return 'Дата не указана';

  return new Intl.DateTimeFormat('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value);
};

const resolveWorkoutId = (workout: Workout) => workout._id ?? workout.name ?? '';

const openWorkout = (workout: Workout) => {
  const id = resolveWorkoutId(workout);
  if (!id) return;
  router.push(`/client/${clientId.value}/workout/${id}`);
};

const goBackToClients = () => {
  router.push({ name: 'clients' });
};

onMounted(async () => {
  try {
    isLoading.value = true;
    client.value = await clientModel.getClientById(clientId.value);
    if (client.value) {
      workoutModel.setClient(client.value);
      workouts.value = await workoutModel.getWorkoutsForClient();
    }
  } catch (err) {
    error.value = 'Не удалось загрузить данные клиента';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <v-container class="py-6">
    <v-card v-if="client" variant="elevated" class="pa-4">
      <div class="d-flex flex-column ga-3">
        <div class="d-flex align-center justify-space-between ga-4 flex-wrap">
          <div class="d-flex align-center ga-3">
            <v-btn icon="mdi-arrow-left" variant="text" @click="goBackToClients" />
            <v-avatar color="primary" size="52">
              <span class="text-h6 text-white">{{ clientInitial }}</span>
            </v-avatar>
            <div>
              <div class="text-h5 font-weight-medium">{{ client.name }}</div>
              <div class="text-body-2 text-medium-emphasis">
                {{ client.notes || 'Нет заметок о клиенте' }}
              </div>
            </div>
          </div>
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="$plus"
            :to="{ name: 'workout', params: { id: clientId } }"
          >
            Добавить тренировку
          </v-btn>
        </div>

        <v-divider />

        <div class="d-flex align-center justify-space-between">
          <div class="text-subtitle-1 font-weight-medium">Назначенные тренировки</div>
          <v-chip color="primary" variant="flat" size="small">
            {{ workouts.length }} всего
          </v-chip>
        </div>

        <v-alert v-if="error" type="error" variant="tonal" density="compact">
          {{ error }}
        </v-alert>

        <v-skeleton-loader
          v-else-if="isLoading"
          type="list-item-two-line, card, card, actions"
          class="mt-2"
        />

        <v-empty-state
          v-else-if="!hasWorkouts"
          icon="$warning"
          title="Нет назначенных тренировок для клиента"
          text="Назначьте первую тренировку клиенту, чтобы увидеть список здесь."
          class="my-4"
        />

        <v-row v-else dense class="mt-1">
          <v-col
            v-for="(workout, index) in workouts"
            :key="workout._id || workout.name || index"
            cols="12"
            md="6"
            lg="4"
          >
            <v-card variant="outlined" class="h-100 d-flex flex-column">
              <v-card-item>
                <div class="d-flex justify-space-between align-start ga-2">
                  <div>
                    <div class="text-subtitle-1 font-weight-medium">
                      {{ workout.name || 'Без названия' }}
                    </div>
                    <div class="text-body-2 text-medium-emphasis">
                      {{ formatDate(workout.date) }}
                    </div>
                  </div>
                  <v-chip v-if="workout.frequency" color="success" size="small" variant="flat">
                    {{ workout.frequency }}
                  </v-chip>
                </div>
              </v-card-item>

              <v-card-text class="text-body-2 text-medium-emphasis">
                {{ workout.description || 'Описание не добавлено' }}
              </v-card-text>

              <v-spacer />

              <v-card-actions class="pt-0">
                <v-btn variant="text" prepend-icon="mdi-open-in-new" @click="openWorkout(workout)">
                  Открыть
                </v-btn>
                <v-btn
                  variant="outlined"
                  color="primary"
                  prepend-icon="mdi-pencil"
                  :disabled="!resolveWorkoutId(workout)"
                  :to="
                    resolveWorkoutId(workout)
                      ? { name: 'workout-edit', params: { id: clientId, workoutId: resolveWorkoutId(workout) } }
                      : undefined
                  "
                >
                  Редактировать
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-container>
</template>
