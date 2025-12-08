<script setup lang="ts">
import { computed } from 'vue';
import type { Exercise } from '../../model';

const props = defineProps<{
  exercise: Exercise;
}>();

const isOpen = defineModel();

const embedUrl = computed((): string => {
  const { videoUrl } = props.exercise;

  let videoIdMatch = videoUrl.match(
    /(?:youtube\.com\/(?:.*v=|embed\/|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : videoUrl;
});
</script>

<template>
  <v-bottom-sheet v-if="exercise" v-model="isOpen">
    <v-sheet class="pa-4">
      <v-row justify="space-between" align="center">
        <v-col cols="10">
          <h3 class="text-h6 font-weight-bold">
            {{ exercise.name }}
          </h3>
        </v-col>
        <v-col cols="2" class="text-right">
          <v-btn icon @click="$emit('update:model-value', false)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" class="text-center">
          <iframe v-if="exercise.videoUrl" :src="embedUrl" allowfullscreen class="video-iframe" />
        </v-col>
      </v-row>

      <v-row class="mt-2" v-if="exercise.bodyParts.length">
        <v-col cols="4">
          <p class="text-body-2 font-weight-bold">Целевая группа:</p>
        </v-col>
        <v-col cols="8">
          <v-chip-group column>
            <v-chip v-for="part in exercise.bodyParts" :key="part" color="primary" size="small">
              {{ part }}
            </v-chip>
          </v-chip-group>
        </v-col>
      </v-row>

      <v-row v-if="exercise.equipments.length">
        <v-col cols="4">
          <p class="text-body-2 font-weight-bold">Оборудование:</p>
        </v-col>
        <v-col cols="8">
          <v-chip-group column>
            <v-chip
              v-for="equip in exercise.equipments"
              :key="equip"
              color="blue-grey"
              size="small"
            >
              {{ equip }}
            </v-chip>
          </v-chip-group>
        </v-col>
      </v-row>

      <v-row v-if="exercise.tags.length">
        <v-col cols="4">
          <p class="text-body-2 font-weight-bold">Теги:</p>
        </v-col>
        <v-col cols="8">
          <v-chip-group column>
            <v-chip v-for="tag in exercise.tags" :key="tag" color="green" size="small">
              {{ tag }}
            </v-chip>
          </v-chip-group>
        </v-col>
      </v-row>
    </v-sheet>
  </v-bottom-sheet>
</template>

<style scoped>
.video-iframe {
  width: 100%;
  max-width: 560px;
  height: 315px;
  border-radius: 8px;
}
</style>
