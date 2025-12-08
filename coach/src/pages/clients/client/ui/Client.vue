<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import { useClientModel } from '@/feature/client-management';
import { useWorkoutModel } from '@/feature/workout-management';
import type { Client } from '@/entities/client';

const clientModel = useClientModel();
const workoutModel = useWorkoutModel();
const route = useRoute();

const clientId = computed<string>(() => route.params.id);
const client = ref<Client | null>(null);

const workouts = ref([]);

onMounted(async () => {
  client.value = await clientModel.getClientById(clientId.value);
  workoutModel.setClient(client.value);

  workouts.value = await workoutModel.getWorkoutsForClient();
  console.log(workouts.value);
});
</script>

<template>
  <v-card v-if="client" min-height="100%">
    <div class="d-flex align-center justify-space-between pr-2">
      <div>
        <v-card-title>
          {{ client.name }}
        </v-card-title>
        <v-card-subtitle>
          {{ client.notes }}
        </v-card-subtitle>
      </div>
      <v-btn
        type="primary"
        prepend-icon="$plus"
        :to="{ name: 'workout', params: { id: clientId } }"
      >
        Добавить тренировку
      </v-btn>
    </div>
    <v-card-text>
      <v-empty-state
        v-if="!workouts.length"
        icon="$warning"
        title="Нет назначенных тренировок для клиента"
      />
      <v-list v-else class="mt-4">
        <v-list-item v-for="workout in workouts" :key="workout._id">
          <v-card>
            <v-card-title>{{ workout.name }}</v-card-title>
            <v-card-subtitle>{{ workout.date }}</v-card-subtitle>
            <v-card-text>
              {{ workout.description }}
            </v-card-text>
            <v-card-actions>
              <v-btn @click="$router.push(`/client/${route.params.id}/workout/${workout._id}`)"
                >Открыть</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
