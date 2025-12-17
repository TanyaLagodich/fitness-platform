<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const tabs = [
  { label: 'Упражнения', value: 'library-exercises' },
  { label: 'Теги', value: 'library-tags' },
  { label: 'Части тела', value: 'library-bodyparts' },
  { label: 'Оборудование', value: 'library-equipments' },
];

const current = () => (route.name as string) || 'library-exercises';

const onChange = (val: unknown) => {
  if (typeof val === 'string') {
    router.push({ name: val });
  }
};
</script>

<template>
  <v-container class="py-6">
    <v-card>
      <v-card-item>
        <div class="d-flex align-center justify-space-between flex-wrap ga-2">
          <div>
            <div class="text-h6">Библиотека</div>
            <div class="text-body-2 text-medium-emphasis">Управление упражнениями и справочниками</div>
          </div>
        </div>
      </v-card-item>
      <v-tabs :model-value="current()" @update:model-value="onChange">
        <v-tab v-for="tab in tabs" :key="tab.value" :value="tab.value">{{ tab.label }}</v-tab>
      </v-tabs>
      <v-divider />
      <v-card-text>
        <router-view />
      </v-card-text>
    </v-card>
  </v-container>
</template>

