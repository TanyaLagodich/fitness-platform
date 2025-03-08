<script setup lang="ts">
import { ref } from 'vue';
const drawer = ref<boolean>(false);

const items = ref([
  {
    title: 'Клиенты',
    value: 'clients',
    link: true,
    name: 'clients',
  },
  {
    title: 'Упражнения',
    value: 'exercise',
    link: true,
    name: 'exercise',
  }
])

</script>

<template>
  <v-app>
    <v-layout>
      <v-app-bar
          color="primary"
          prominent
      >
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>ProTrainers</v-toolbar-title>

        <v-spacer></v-spacer>

        <template v-if="$vuetify.display.mdAndUp">
          <v-btn icon="mdi-magnify" variant="text"></v-btn>

          <v-btn icon="mdi-filter" variant="text"></v-btn>
        </template>

        <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>
      </v-app-bar>

      <v-navigation-drawer
          v-model="drawer"
          :location="$vuetify.display.mobile ? 'bottom' : undefined"
          :class="{ 'position-fixed': $vuetify.display.mobile }"
          :temporary="true"
      >
        <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :link="true"
            :title="item.title"
            :to="{ name: item.value }"
        />
      </v-navigation-drawer>

      <v-main>
        <router-view />
      </v-main>
    </v-layout>
  </v-app>
</template>
