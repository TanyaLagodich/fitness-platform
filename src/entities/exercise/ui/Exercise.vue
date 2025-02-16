<script lang="ts" setup>
import { computed } from 'vue';
import { Exercise } from "@/shared/types";

const props = defineProps<{ exercise: Exercise }>();

const extractYouTubeVideoId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|shorts\/)([^"&?/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const videoUrl = computed(() => `https://img.youtube.com/vi/${extractYouTubeVideoId(props.exercise.videoUrl)}/maxresdefault.jpg`)

</script>

<template>
  <v-card
      class="mx-auto"
      max-width="344"
      :hover="true"
      width="100%"
  >
    <v-card-text
      class="text-h6"
    >
      {{ exercise.name }}

      <div>
        <img
            :src="videoUrl"
            :alt="exercise.description || exercise.name"
            aspect-ratio="1/1"
            width="100%"
            height="100%"
        />
      </div>
    </v-card-text>
  </v-card>
</template>
