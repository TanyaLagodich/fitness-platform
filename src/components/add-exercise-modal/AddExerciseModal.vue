<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import {
  Delete,
} from '@element-plus/icons-vue';

const props = defineProps<{ visible: boolean }>();
const emits = defineEmits(['close', 'save']);

const newCircuit = ref({
  name: '',
  exercises: [
    {
      name: '',
      description: '',
      sets: 0,
      reps: 0,
      weight: 0,
      videoLink: '',
    }
  ],
});

// Данные для нового упражнения
const newExercise = ref({
  name: '',
  description: '',
  sets: 0,
  reps: 0,
  weight: 0,
  videoLink: '',
});

const activeCollapseItem = ref(0);

// Сохранение упражнения
const saveCircuit = () => {
  emits('save', { ...newCircuit.value });
  // Очистка формы
  // newExercise.value = { name: '', description: '', sets: 0, reps: 0, weight: 0, videoLink: '' };
};

const addExerciseInCircuit = () => {
  newCircuit.value.exercises.push({
    name: '',
    description: '',
    sets: 0,
    reps: 0,
    weight: 0,
    videoLink: '',
  });

  activeCollapseItem.value = newCircuit.value.exercises.length - 1;
}

const deleteExercise = (index: number) => {
  newCircuit.value.exercises.splice(index, 1);
}
</script>

<template>
  <el-dialog title="Новый круг" :model-value="visible" class="new-circuit">
    <el-form :model="newCircuit" label-width="120px">
      <el-form-item label="Название круга">
        <el-input v-model="newCircuit.name" placeholder="Enter exercise name" />
      </el-form-item>
      <el-collapse v-model="activeCollapseItem">
        <el-collapse-item
          v-for="(exercise, index) in newCircuit.exercises"
          :key="index"
          :title="exercise.name ? exercise.name : `Упражнение №${index + 1}`"
          :name="index"
        >
          <el-card>
            <el-form-item label="Название упражнения">
              <el-input v-model="exercise.name" placeholder="Название упражнение" />
            </el-form-item>
            <el-form-item label="Description">
              <el-input
                  type="textarea"
                  v-model="newExercise.description"
                  placeholder="Enter exercise description"
              />
            </el-form-item>
            <el-form-item label="Sets">
              <el-input-number v-model="newExercise.sets" :min="1" placeholder="Enter sets" />
            </el-form-item>
            <el-form-item label="Reps">
              <el-input-number v-model="newExercise.reps" :min="1" placeholder="Enter reps" />
            </el-form-item>
            <el-form-item label="Weight (kg)">
              <el-input-number v-model="newExercise.weight" :min="0" placeholder="Enter weight" />
            </el-form-item>
            <el-form-item label="Video Link">
              <el-input
                  v-model="newExercise.videoLink"
                  placeholder="Enter video link (optional)"
              />
            </el-form-item>
            <template #footer>
              <el-button
                  :disabled="newCircuit.exercises.length < 2"
                  type="danger"
                  :icon="Delete"
                  @click="deleteExercise(index)"
              >
                Удалить
              </el-button>
            </template>
          </el-card>
        </el-collapse-item>
      </el-collapse>
      <div class="new-circuit__add-exercise-btn">
        <el-button
            @click="addExerciseInCircuit"
        >
          Добавить упражнение
        </el-button>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="emits('close')">Отменить</el-button>
      <el-button type="primary" @click="saveCircuit">Сохранить</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss">
.new-circuit {
  .el-card__footer {
    display: flex;
    justify-content: flex-end;
  }

  &__add-exercise-btn {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
