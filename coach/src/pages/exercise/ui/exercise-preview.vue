<script setup lang="ts">
import type { Exercise } from '@/shared/types';
import { getYoutubeThumbnail, getYoutubeEmbedUrl } from '@/shared/utils';

const props = defineProps<{
  modelValue: boolean;
  exercise: Exercise | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const close = () => emit('update:modelValue', false);
</script>

<template>
  <v-dialog :model-value="props.modelValue" max-width="900" @update:model-value="emit('update:modelValue', $event)">
    <v-card v-if="props.exercise">
      <v-card-title class="d-flex justify-space-between align-center">
        {{ props.exercise?.name || 'Предпросмотр' }}
        <v-btn icon="mdi-close" variant="text" @click="close" />
      </v-card-title>
      <v-card-text>
        <div class="d-flex ga-4 flex-wrap">
          <v-img
            v-if="props.exercise?.thumbnailUrl"
            :src="props.exercise?.thumbnailUrl"
            :alt="props.exercise?.name"
            max-width="280"
            aspect-ratio="16/9"
            cover
            class="rounded"
          />
          <div class="flex-grow-1">
            <div class="text-body-1 text-medium-emphasis mb-2">
              {{ props.exercise?.description || 'Без описания' }}
            </div>
            <div class="d-flex flex-wrap ga-2 mb-2">
              <v-chip
                v-for="part in props.exercise?.bodyParts"
                :key="`bp-${part}`"
                size="small"
                color="secondary"
                variant="tonal"
              >
                {{ part }}
              </v-chip>
              <v-chip
                v-for="tag in props.exercise?.tags"
                :key="`tag-${tag}`"
                size="small"
                color="primary"
                variant="outlined"
              >
                {{ tag }}
              </v-chip>
            </div>
            <div class="d-flex flex-wrap ga-2 mb-2">
              <v-chip
                v-for="equip in props.exercise?.equipments"
                :key="`eq-${equip}`"
                size="small"
                color="info"
                variant="tonal"
              >
                {{ equip }}
              </v-chip>
            </div>
            <div v-if="props.exercise?.videoUrl" class="mt-2">
              <v-btn
                color="primary"
                variant="tonal"
                prepend-icon="mdi-play-circle"
                :href="props.exercise?.videoUrl"
                target="_blank"
              >
                Открыть видео
              </v-btn>
            </div>
          </div>
        </div>

        <div class="ratio-16-9 mt-4" v-if="props.exercise?.videoUrl">
          <iframe
            v-if="getYoutubeEmbedUrl(props.exercise?.videoUrl)"
            :src="getYoutubeEmbedUrl(props.exercise?.videoUrl)"
            width="100%"
            height="480"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
          <v-img
            v-else
            :src="getYoutubeThumbnail(props.exercise?.videoUrl)"
            height="320"
            cover
            class="rounded"
          />
        </div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="close">Закрыть</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

