<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { Exercise } from '@/shared/types';
import { useExerciseManagementStore } from '@/feature/exercise-management';
import { useExercisesApi } from '@/shared/api';

const props = defineProps<{
  modelValue: boolean;
  exercise?: Exercise | null;
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', value: Exercise): void;
}>();

const exerciseManagementStore = useExerciseManagementStore();
const exerciseMetaData = exerciseManagementStore.exerciseMetaData;
const exercisesApi = useExercisesApi();
const errorMessage = ref('');
const saving = ref(false);

const form = ref<Exercise>({
  _id: undefined,
  name: '',
  description: '',
  bodyParts: [],
  equipments: [],
  tags: [],
  videoUrl: '',
  thumbnailUrl: '',
});

const resetForm = () => {
  form.value = {
    _id: undefined,
    name: '',
    description: '',
    bodyParts: [],
    equipments: [],
    tags: [],
    videoUrl: '',
    thumbnailUrl: '',
  };
};

watch(
  () => props.exercise,
  (value) => {
    if (value) {
      form.value = { ...value };
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

const close = () => emits('update:modelValue', false);
const submit = async () => {
  errorMessage.value = '';
  const name = form.value.name?.trim();
  if (!name) {
    errorMessage.value = 'Введите название упражнения';
    return;
  }

  const uniq = (arr: string[]) => {
    const seen = new Set<string>();
    return arr
      .map((v) => v.trim())
      .filter((v) => v.length)
      .filter((v) => {
        const key = v.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  };

  form.value.name = name;
  form.value.bodyParts = uniq(form.value.bodyParts);
  form.value.equipments = uniq(form.value.equipments);
  form.value.tags = uniq(form.value.tags);

  saving.value = true;
  emits('save', { ...form.value });
  saving.value = false;
};

onMounted(exerciseManagementStore.fetchExerciseMetaData);

const getYoutubeThumbnail = (url?: string) => {
  if (!url) return '';
  const trimmed = url.trim();
  const match =
    trimmed.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:\?|&|$)/) ||
    trimmed.match(/youtu\.be\/([0-9A-Za-z_-]{11})/);
  const id = match?.[1];
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
};

const copyLink = async () => {
  if (!form.value.videoUrl) return;
  try {
    await navigator.clipboard.writeText(form.value.videoUrl);
  } catch (e) {
    console.error(e);
  }
};

const handleMetaChange = async (
  type: 'bodyPart' | 'equipment' | 'tag',
  values: string[],
  apply: (val: string[]) => void
) => {
  const trimmed = values.map((v) => v.trim()).filter((v) => v.length > 1);
  const newOnes: string[] = [];
  if (type === 'bodyPart') {
    trimmed.forEach((v) => {
      if (!exerciseMetaData.bodyParts.includes(v)) newOnes.push(v);
    });
    if (newOnes.length) await Promise.all(newOnes.map((v) => exercisesApi.addBodyPart(v)));
  }
  if (type === 'equipment') {
    trimmed.forEach((v) => {
      if (!exerciseMetaData.equipments.includes(v)) newOnes.push(v);
    });
    if (newOnes.length) await Promise.all(newOnes.map((v) => exercisesApi.addEquipment(v)));
  }
  if (type === 'tag') {
    trimmed.forEach((v) => {
      if (!exerciseMetaData.tags.includes(v)) newOnes.push(v);
    });
    if (newOnes.length) await Promise.all(newOnes.map((v) => exercisesApi.addTag(v)));
  }
  if (newOnes.length) {
    await exerciseManagementStore.fetchExerciseMetaData();
  }
  apply(trimmed);
};
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="720" @update:model-value="emits('update:modelValue', $event)">
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h6">{{ form._id ? 'Редактировать упражнение' : 'Новое упражнение' }}</span>
        <v-btn icon="mdi-close" variant="text" @click="close" />
      </v-card-title>

      <v-alert v-if="errorMessage" type="error" variant="tonal" class="mx-4 mt-2">
        {{ errorMessage }}
      </v-alert>

      <v-card-text class="d-flex flex-column ga-4">
        <v-text-field v-model="form.name" label="Название" required />
        <v-textarea v-model="form.description" label="Описание" auto-grow />

        <v-combobox
          v-model="form.bodyParts"
          :items="exerciseMetaData.bodyParts"
          label="Части тела"
          multiple
          clearable
          chips
          closable-chips
          @change="
            (v: string[]) =>
              handleMetaChange('bodyPart', v, (val: string[]) => {
                form.bodyParts = val;
              })
          "
          @keydown.enter.prevent
        />

        <v-combobox
          v-model="form.equipments"
          :items="exerciseMetaData.equipments"
          label="Оборудование"
          multiple
          clearable
          chips
          closable-chips
          @change="
            (v: string[]) =>
              handleMetaChange('equipment', v, (val: string[]) => {
                form.equipments = val;
              })
          "
          @keydown.enter.prevent
        />

        <v-combobox
          v-model="form.tags"
          :items="exerciseMetaData.tags"
          label="Теги"
          multiple
          clearable
          chips
          closable-chips
          @change="
            (v: string[]) =>
              handleMetaChange('tag', v, (val: string[]) => {
                form.tags = val;
              })
          "
          @keydown.enter.prevent
        />

        <v-text-field
          v-model="form.videoUrl"
          label="Ссылка на видео"
          prepend-inner-icon="mdi-youtube"
          append-inner-icon="mdi-content-copy"
          @click:append-inner="copyLink"
        />
        <v-text-field v-model="form.thumbnailUrl" label="Ссылка на превью (опционально)" />

        <div class="d-flex ga-4 align-start" v-if="form.videoUrl || form.thumbnailUrl">
          <v-img
            v-if="getYoutubeThumbnail(form.videoUrl) || form.thumbnailUrl"
            :src="form.thumbnailUrl || getYoutubeThumbnail(form.videoUrl)"
            max-width="240"
            aspect-ratio="16/9"
            cover
            class="rounded"
          />
          <v-btn
            v-if="form.videoUrl"
            color="primary"
            variant="text"
            prepend-icon="mdi-open-in-new"
            :href="form.videoUrl"
            target="_blank"
          >
            Открыть видео
          </v-btn>
        </div>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="close">Отмена</v-btn>
        <v-btn color="primary" :disabled="!form.name || saving" :loading="saving" @click="submit">
          {{ form._id ? 'Сохранить' : 'Создать' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

