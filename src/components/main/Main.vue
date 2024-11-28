<script setup lang="ts">
import { ref } from 'vue';
import type { Client } from '@/types';
import ClientInfo from '@/components/client-info/ClientInfo.vue';
import WorkoutPlan from '@/components/workout-plan/WorkoutPlan.vue';
import AddExerciseModal from '@/components/add-exercise-modal/AddExerciseModal.vue';

// Клиент
const props = defineProps<{ client: Client }>();

// План тренировок
const workoutPlan = ref([]);

const workouts = ref([
  {
    name: 'Тренировка 1',
    plan: [
      {
        name: 'Мощность',
        exercises: [
          {
            name: 'Махи гирей',
            description: 'Описание для махов гирей',
            sets: 4,
            reps: 10,
            weight: 16,
            videoLink: '',
          }
        ]
      },
      {
        name: 'Сила',
        exercises: [
          {
            name: 'Приседания',
            description: 'Описание для приседаний',
            sets: 4,
            reps: 10,
            weight: 16,
            videoLink: '',
          }
        ]
      }
    ],
  }
]);

const activeWorkout = ref(0);

// Состояние модального окна
const showAddExerciseModal = ref(false);

// Добавление упражнения
const addCircuit = (circuit) => {
  workoutPlan.value.push(circuit);
  showAddExerciseModal.value = false;
};

// Удаление упражнения
const removeExercise = (exercise) => {
  workoutPlan.value = workoutPlan.value.filter((e) => e !== exercise);
};

const addWorkout = () => {
  const newWorkout = Object.assign({}, workouts.value[0]);
  newWorkout.name = `Тренировка ${workouts.value.length + 1}`;
  workouts.value.push(newWorkout);
}

const removeWorkout = () => {}
</script>

<template>
  <el-main class="main">
    <el-card v-if="props.client">
      <template #header>
        <div class="card-header">
          <el-text size="large" tag="b">
            {{ props.client.name }}
          </el-text>
        </div>
      </template>
      <el-text>
        {{ props.client.notes }}
      </el-text>

    <div>
      <el-tabs
          v-model="activeWorkout"
          class="workouts"
          @tab-click="() => {}"
          type="card"
          editable
          @tab-add="addWorkout"
          @tab-remove="removeWorkout"
      >
        <el-tab-pane
            v-for="(workout, index) in workouts"
            :key="index"
            :label="workout.name"
            :name="index">
          <WorkoutPlan
              :workout-plan="workout.plan"
              @add-exercise="showAddExerciseModal = true"
              @remove-exercise="removeExercise"
          />
        </el-tab-pane>
      </el-tabs>
    </div>

    <AddExerciseModal
        :visible="showAddExerciseModal"
        @close="showAddExerciseModal = false"
        @save="addCircuit"
    />
    </el-card>
  </el-main>
</template>

<style scoped>
.main {
  padding: 20px;
}
</style>
