<script setup lang="ts">
import { ref } from 'vue';
import { useClientStore } from '../model/clientStore.ts';
import { Client } from '../../../shared/types';
import AddClientModal from './AddClientModal.vue';

const emits = defineEmits<{ (e: 'update:modelValue', client: Client): void }>();
const props = defineProps<{ modelValue: Client | null }>();

const { search, isLoading, filteredClients, filterClients, clients, addNewClient } =
  useClientStore();

const showAddClientModal = ref<boolean>(false);
const drawer = ref<boolean>(true);

const handleClientAdded = async (client: Client) => {
  await addNewClient(client);
  showAddClientModal.value = false;
};

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};
</script>

<template>
  <el-aside :width="isSidebarCollapsed ? '50px' : '300px'" class="sidebar">
    <el-drawer v-model="drawer" direction="ltr" :append-to-body="true">
      <!-- Поиск -->
      <el-input v-model="search" placeholder="Search clients" clearable @input="filterClients" />

      <!-- Список клиентов -->
      <el-menu default-active="2" class="clients-list">
        <el-menu-item
          v-for="(client, index) in clients"
          :key="client.id"
          :index="index"
          @click="emits('update:modelValue', client)"
        >
          {{ client.name }}
        </el-menu-item>
      </el-menu>

      <!-- Управление -->
      <div class="clients-list__controls">
        <el-button type="primary" class="clients-list__add" @click="showAddClientModal = true">
          Add New Client
        </el-button>
        <el-button type="danger" :disabled="!props.modelValue" class="clients-list__remove">
          Remove Selected Client
        </el-button>
      </div>

      <AddClientModal
        :model-value="showAddClientModal"
        @update:model-value="showAddClientModal = $event"
        @add-new-client="handleClientAdded"
      />
    </el-drawer>
  </el-aside>
</template>

<style lang="scss" scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  position: relative;

  &-toggle {
    position: absolute;
    top: 12px;
    right: -25px;
    width: 25px;
    height: 25px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.3s ease;
  }

  &-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: opacity 0.3s ease;
  }

  .clients-list {
    flex-grow: 1;

    &__controls {
      padding: 12px;
      display: flex;
      flex-direction: column;
    }

    &__add {
      margin-bottom: 12px;
    }

    &__remove {
      margin-left: 0;
    }
  }
}
</style>
