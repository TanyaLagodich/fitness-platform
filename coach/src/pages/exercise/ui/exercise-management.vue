<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useExercisesApi } from '@/shared/api';
import type { Exercise } from '@/shared/types';
import ExerciseForm from '@/feature/exercise-management/ui/ExerciseForm.vue';
import { useExerciseManagementStore } from '@/feature/exercise-management';
import { getYoutubeThumbnail, getYoutubeEmbedUrl } from '@/shared/utils';
import { useNotificationStore } from '@/shared/store';
import ExercisePreview from './exercise-preview.vue';

const exercisesApi = useExercisesApi();
const exerciseManagementStore = useExerciseManagementStore();
const notificationStore = useNotificationStore();

const exercises = ref<Exercise[]>([]);
const isLoading = ref(false);
const isFormOpen = ref(false);
const editingExercise = ref<Exercise | null>(null);
const search = ref('');
const selectedBodyParts = ref<string[]>([]);
const selectedEquipments = ref<string[]>([]);
const selectedTags = ref<string[]>([]);
const videoPreview = ref<{ open: boolean; url: string | null }>({ open: false, url: null });
const debounceTimer = ref<number | null>(null);
const page = ref(1);
const perPage = 12;
const preview = ref<{ open: boolean; exercise: Exercise | null }>({ open: false, exercise: null });

const fetchExercises = async () => {
  isLoading.value = true;
  try {
    exercises.value =
      (await exercisesApi.getExercises({
        search: search.value,
        'bodyParts[]': selectedBodyParts.value,
        'equipments[]': selectedEquipments.value,
        'tags[]': selectedTags.value,
      })) ?? [];
  } catch {
    notificationStore.toggle('Не удалось загрузить упражнения', 'error');
  } finally {
    isLoading.value = false;
  }
};

const openCreate = () => {
  editingExercise.value = null;
  isFormOpen.value = true;
};

const openEdit = (exercise: Exercise) => {
  editingExercise.value = { ...exercise };
  isFormOpen.value = true;
};

const handleSave = async (exercise: Exercise) => {
  try {
    if (exercise._id) {
      await exercisesApi.updateExercise(exercise._id, exercise);
      notificationStore.toggle('Упражнение обновлено', 'success');
    } else {
      await exercisesApi.createExercise(exercise);
      notificationStore.toggle('Упражнение создано', 'success');
    }
    isFormOpen.value = false;
    await fetchExercises();
  } catch {
    notificationStore.toggle('Не удалось сохранить упражнение', 'error');
  }
};

const deleteExercise = async (exercise: Exercise) => {
  if (!exercise._id) return;
  const ok = window.confirm(`Удалить упражнение "${exercise.name}"?`);
  if (!ok) return;
  try {
    await exercisesApi.deleteExercise(exercise._id);
    notificationStore.toggle('Упражнение удалено', 'success');
    await fetchExercises();
  } catch {
    notificationStore.toggle('Не удалось удалить упражнение', 'error');
  }
};

const filteredExercises = computed(() => {
  if (!search.value) return exercises.value;
  const term = search.value.toLowerCase();
  return exercises.value.filter((item) => item.name.toLowerCase().includes(term));
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredExercises.value.length / perPage))
);

const pagedExercises = computed(() => {
  const start = (page.value - 1) * perPage;
  return filteredExercises.value.slice(start, start + perPage);
});

onMounted(async () => {
  await Promise.all([exerciseManagementStore.fetchExerciseMetaData(), fetchExercises()]);
});

watch(
  () => search.value,
  () => {
    if (debounceTimer.value) window.clearTimeout(debounceTimer.value);
    debounceTimer.value = window.setTimeout(() => fetchExercises(), 350);
  }
);

watch(filteredExercises, () => {
  page.value = 1;
});

const openPreview = (exercise: Exercise) => {
  preview.value = { open: true, exercise };
};

const getEmbedWithAutoplay = (url?: string) => {
  const embed = getYoutubeEmbedUrl(url);
  if (!embed) return '';
  const separator = embed.includes('?') ? '&' : '?';
  return `${embed}${separator}autoplay=1`;
};
</script>

<template>
  <v-container class="py-6">
    <v-card>
      <v-card-text>
        <div class="d-flex align-center justify-space-between flex-wrap ga-2 mb-4">
          <div>
            <div class="text-h6">Управление упражнениями</div>
            <div class="text-body-2 text-medium-emphasis">Просмотр, создание, редактирование, удаление</div>
          </div>
          <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreate">Добавить упражнение</v-btn>
        </div>

        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Поиск по названию"
          class="mb-4"
          clearable
          @click:clear="fetchExercises"
        />

        <v-row class="mb-4" dense>
          <v-col cols="12" md="4">
            <v-combobox
              v-model="selectedBodyParts"
              :items="exerciseManagementStore.exerciseMetaData.bodyParts"
              label="Части тела"
              multiple
              clearable
              chips
              closable-chips
              @update:model-value="fetchExercises"
              @keydown.enter.prevent
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-combobox
              v-model="selectedEquipments"
              :items="exerciseManagementStore.exerciseMetaData.equipments"
              label="Оборудование"
              multiple
              clearable
              chips
              closable-chips
              @update:model-value="fetchExercises"
              @keydown.enter.prevent
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-combobox
              v-model="selectedTags"
              :items="exerciseManagementStore.exerciseMetaData.tags"
              label="Теги"
              multiple
              clearable
              chips
              closable-chips
              @update:model-value="fetchExercises"
              @keydown.enter.prevent
            />
          </v-col>
        </v-row>

        <v-skeleton-loader v-if="isLoading" type="list-item-two-line, list-item-two-line, list-item-two-line" />

        <v-empty-state
          v-else-if="!filteredExercises.length"
          icon="mdi-alert-circle-outline"
          title="Упражнений нет"
          text="Добавьте новое упражнение или измените фильтр."
          class="my-6"
        />

        <v-row v-else dense>
          <v-col v-for="exercise in pagedExercises" :key="exercise._id" cols="12" md="6" lg="4">
              <v-card variant="outlined" class="exercise-card h-100">
              <v-hover v-slot="{ isHovering, props }">
                <div
                  v-bind="props"
                  class="cursor-pointer preview-wrapper"
                  @click="() => openPreview(exercise)"
                >
                  <template v-if="exercise.thumbnailUrl">
                    <v-img
                      :src="exercise.thumbnailUrl"
                      :alt="exercise.name"
                      aspect-ratio="16/9"
                      cover
                      class="rounded-t w-100"
                    />
                    <div class="hover-overlay d-flex align-center justify-center" :class="{ 'hover-overlay--active': isHovering }">
                      <v-icon v-if="isHovering" size="56" color="white">mdi-play-circle</v-icon>
                    </div>
                    <div class="play-badge d-flex align-center justify-center">
                      <v-icon size="28" color="white">mdi-play</v-icon>
                    </div>
                  </template>
                  <template v-else>
                    <v-responsive aspect-ratio="16/9" class="rounded-t bg-grey-lighten-3 w-100 d-flex align-center justify-center">
                      <v-icon size="48" color="primary">mdi-play-circle</v-icon>
                    </v-responsive>
                  </template>
                </div>
              </v-hover>
              <v-card-item class="pb-0">
                <div class="d-flex flex-column ga-2">
                  <div class="text-subtitle-1 font-weight-medium">{{ exercise.name }}</div>
                  <div class="text-body-2 text-medium-emphasis">{{ exercise.description || 'Без описания' }}</div>
                  <div class="d-flex flex-wrap ga-1">
                    <v-chip v-for="part in exercise.bodyParts" :key="`bp-${part}`" size="x-small" color="secondary" variant="tonal">
                      {{ part }}
                    </v-chip>
                    <v-chip v-for="tag in exercise.tags" :key="`tag-${tag}`" size="x-small" color="primary" variant="outlined">
                      {{ tag }}
                    </v-chip>
                  </div>
                </div>
              </v-card-item>
              <v-card-actions class="justify-end pa-3">
                <v-btn icon="mdi-pencil" variant="text" @click="openEdit(exercise)" />
                <v-btn icon="mdi-delete" variant="text" color="error" @click="deleteExercise(exercise)" />
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <div class="d-flex justify-center mt-4" v-if="totalPages > 1">
          <v-pagination
            v-model="page"
            :length="totalPages"
            :total-visible="7"
            rounded
          />
        </div>
      </v-card-text>
    </v-card>

    <exercise-form
      v-model="isFormOpen"
      :exercise="editingExercise"
      @save="handleSave"
      @update:model-value="isFormOpen = $event"
    />

    <v-dialog v-model="videoPreview.open" max-width="900">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          Видео
          <v-btn icon="mdi-close" variant="text" @click="videoPreview.open = false" />
        </v-card-title>
        <v-card-text>
          <div v-if="videoPreview.url" class="d-flex flex-column ga-3">
            <div class="ratio-16-9">
              <iframe
                v-if="getYoutubeEmbedUrl(videoPreview.url)"
                :src="getEmbedWithAutoplay(videoPreview.url)"
                width="100%"
                height="480"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              />
              <v-img
                v-else
                :src="getYoutubeThumbnail(videoPreview.url)"
                height="320"
                cover
                class="rounded"
              />
            </div>
            <div class="d-flex ga-2">
              <v-btn
                v-if="!getYoutubeEmbedUrl(videoPreview.url)"
                color="primary"
                variant="flat"
                prepend-icon="mdi-open-in-new"
                :href="videoPreview.url"
                target="_blank"
              >
                Открыть на YouTube
              </v-btn>
            </div>
          </div>
          <div v-else class="text-medium-emphasis">Ссылка на видео отсутствует</div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <exercise-preview v-model="preview.open" :exercise="preview.exercise" />
  </v-container>
</template>

<style scoped>
.exercise-card {
  display: flex;
  flex-direction: column;
}

.exercise-card :global(.v-card-item) {
  padding-bottom: 0;
}

.exercise-card :global(.v-card-actions) {
  margin-top: auto;
}

.hover-overlay {
  background: rgba(0, 0, 0, 0.35);
}

.hover-overlay,
.hover-container {
  position: absolute;
  inset: 0;
  border-radius: 8px 8px 0 0;
  pointer-events: none;
}

.hover-overlay--active {
  opacity: 1;
}

.hover-overlay {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.play-badge {
  position: absolute;
  right: 12px;
  bottom: 12px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
}

.preview-wrapper {
  position: relative;
}

.hover-overlay {
  position: absolute;
  inset: 0;
  border-radius: 8px 8px 0 0;
  pointer-events: none;
}
</style>

