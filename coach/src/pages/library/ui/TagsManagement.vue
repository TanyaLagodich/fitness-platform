<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useExercisesApi } from '@/shared/api';
import { useNotificationStore } from '@/shared/store';

const api = useExercisesApi();
const notificationStore = useNotificationStore();
const tags = ref<Array<{ _id: string; name: string }>>([]);
const newTag = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const isSaving = ref(false);

const fetchTags = async () => {
  isLoading.value = true;
  try {
    const res = await api.getTags();
    tags.value = res?.data ?? [];
  } catch {
    notificationStore.toggle('Не удалось загрузить теги', 'error');
  } finally {
    isLoading.value = false;
  }
};

const add = async () => {
  const value = newTag.value.trim();
  if (!value) return;
  const exists = tags.value.some((t) => t.name.toLowerCase() === value.toLowerCase());
  if (exists) {
    errorMessage.value = 'Такой тег уже существует';
    return;
  }
  errorMessage.value = '';
  try {
    isSaving.value = true;
    await api.addTag(value);
    notificationStore.toggle('Тег добавлен', 'success');
    newTag.value = '';
    await fetchTags();
  } catch {
    notificationStore.toggle('Не удалось добавить тег', 'error');
  } finally {
    isSaving.value = false;
  }
};

const remove = async (id: string) => {
  const tag = tags.value.find((t) => t._id === id);
  const ok = window.confirm(`Удалить тег "${tag?.name ?? ''}"?`);
  if (!ok) return;
  try {
    isSaving.value = true;
    await api.deleteTag(id);
    notificationStore.toggle('Тег удален', 'success');
    await fetchTags();
  } catch {
    notificationStore.toggle('Не удалось удалить тег', 'error');
  } finally {
    isSaving.value = false;
  }
};

onMounted(fetchTags);
</script>

<template>
  <div class="d-flex flex-column ga-4">
    <v-alert v-if="errorMessage" type="error" variant="tonal" density="compact">
      {{ errorMessage }}
    </v-alert>
    <div class="d-flex ga-2 align-center">
      <v-text-field v-model="newTag" label="Новый тег" density="compact" hide-details clearable />
      <v-btn color="primary" prepend-icon="mdi-plus" :loading="isSaving" :disabled="isSaving" @click="add">
        Добавить
      </v-btn>
    </div>

    <v-skeleton-loader v-if="isLoading" type="list-item-two-line, list-item-two-line" />

    <v-chip-group v-else column>
      <v-chip
        v-for="tag in tags"
        :key="tag._id"
        closable
        color="primary"
        variant="flat"
        :disabled="isSaving"
        @click:close="remove(tag._id)"
      >
        {{ tag.name }}
      </v-chip>
    </v-chip-group>
  </div>
</template>

