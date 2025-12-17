<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useExercisesApi } from '@/shared/api';
import { useNotificationStore } from '@/shared/store';

const api = useExercisesApi();
const notificationStore = useNotificationStore();
const items = ref<Array<{ _id: string; name: string }>>([]);
const input = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const isSaving = ref(false);

const fetchItems = async () => {
  isLoading.value = true;
  try {
    const res = await api.getEquipments();
    items.value = res?.data ?? [];
  } catch {
    notificationStore.toggle('Не удалось загрузить оборудование', 'error');
  } finally {
    isLoading.value = false;
  }
};

const add = async () => {
  const value = input.value.trim();
  if (!value) return;
  const exists = items.value.some((t) => t.name.toLowerCase() === value.toLowerCase());
  if (exists) {
    errorMessage.value = 'Такое оборудование уже существует';
    return;
  }
  errorMessage.value = '';
  try {
    isSaving.value = true;
    await api.addEquipment(value);
    notificationStore.toggle('Оборудование добавлено', 'success');
    input.value = '';
    await fetchItems();
  } catch {
    notificationStore.toggle('Не удалось добавить оборудование', 'error');
  } finally {
    isSaving.value = false;
  }
};

const remove = async (id: string) => {
  const item = items.value.find((t) => t._id === id);
  const ok = window.confirm(`Удалить оборудование "${item?.name ?? ''}"?`);
  if (!ok) return;
  try {
    isSaving.value = true;
    await api.deleteEquipment(id);
    notificationStore.toggle('Оборудование удалено', 'success');
    await fetchItems();
  } catch {
    notificationStore.toggle('Не удалось удалить оборудование', 'error');
  } finally {
    isSaving.value = false;
  }
};

onMounted(fetchItems);
</script>

<template>
  <div class="d-flex flex-column ga-4">
    <v-alert v-if="errorMessage" type="error" variant="tonal" density="compact">
      {{ errorMessage }}
    </v-alert>
    <div class="d-flex ga-2 align-center">
      <v-text-field v-model="input" label="Новое оборудование" density="compact" hide-details clearable />
      <v-btn color="primary" prepend-icon="mdi-plus" :loading="isSaving" :disabled="isSaving" @click="add">
        Добавить
      </v-btn>
    </div>

    <v-skeleton-loader v-if="isLoading" type="list-item-two-line, list-item-two-line" />

    <v-chip-group v-else column>
      <v-chip
        v-for="item in items"
        :key="item._id"
        closable
        color="info"
        variant="tonal"
        :disabled="isSaving"
        @click:close="remove(item._id)"
      >
        {{ item.name }}
      </v-chip>
    </v-chip-group>
  </div>
</template>

