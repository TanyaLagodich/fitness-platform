<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import { Delete, Edit } from '@element-plus/icons-vue';

// Пропсы
const props = defineProps<{ workoutPlan: any[] }>();
const emits = defineEmits(['add-exercise', 'add-circuit', 'remove-exercise']);
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <el-text size="large" tag="b">Workout Plans</el-text>
      </div>
    </template>

    <el-button type="primary" @click="emits('add-exercise')">
      Добавить круг
    </el-button>
    <el-table :data="workoutPlan" border style="margin-top: 20px">
      <el-table-column type="expand">
        <template #default="props">
          <el-table :data="props.row.exercises" border>
            <el-table-column label="Упражнение" prop="name" />
            <el-table-column label="Описание" prop="description" />
            <el-table-column label="Подходы" prop="sets" />
            <el-table-column label="Повторения" prop="reps" />
            <el-table-column label="Вес" prop="weight" />
            <el-table-column label="Видео" prop="videoLink" />

            <el-table-column align="right">
              <template #default="scope">
                <el-button
                    size="small"
                    :icon="Edit"
                />
                <el-button
                    size="small"
                    type="danger"
                    :icon="Delete"
                />
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="Круг" prop="name" />

      <el-table-column align="right">
        <template #default="scope">
          <el-button
              size="small"
              :icon="Edit"
          />
          <el-button
              size="small"
              type="danger"
              :icon="Delete"
          />
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <el-button type="primary">
        Сохранить
      </el-button>
    </template>
  </el-card>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
