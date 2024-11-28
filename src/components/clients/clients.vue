<script setup lang="ts">
import { ref } from 'vue';
import { Client } from '@/types';

const emits = defineEmits<{(e: 'update:modelValue', client: Client): void
}>();

const props = defineProps<{ modelValue: Client | null }>();

const clientName = ref<string>('');

const clients: Client[] = [
  {
    id: 1,
    name: 'Tanya Lagodich',
    notes: 'notes about clients',
  },
  {
    id: 2,
    name: 'Nastya',
    notes: 'notes about client Nastya',
  },
  {
    id: 3,
    name: 'Semen',
    notes: 'notes about client Semen',
  }
]

let filteredClients = clients;

const filterClients = () => {
  filteredClients = clients.filter(({ name }) => name === clientName);
}
</script>

<template>
  <el-aside width="300px" class="sidebar">
    <el-input
        v-model="clientName"
        placeholder="Search clients"
        clearable
        @input="filterClients"
    />
    <el-menu
        default-active="2"
        class="clients-list"
    >
      <el-menu-item
          v-for="(client, index) in clients"
          :key="client.id"
          :index="index"
          @click="emits('update:modelValue', client)"
      >
        {{ client.name }}
      </el-menu-item>
    </el-menu>

    <div class="clients-list__controls">
      <el-button
          type="primary"
          class="clients-list__add"
      >
        Add New Client
      </el-button>
      <el-button
          type="danger"
          :disabled="!client"
          class="clients-list__remove"
      >
        Remove Selected Client
      </el-button>
    </div>
  </el-aside>
</template>

<style lang="scss" scoped>
@use 'clients';
</style>
