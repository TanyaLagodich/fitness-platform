<script setup lang="ts">
import { ref } from 'vue';
import AddClientModal from '@/feature/client-management/ui/AddClientModal.vue';
import { useClientStore } from '@/feature/client-management/model/clientStore.ts';

const clientStore = useClientStore();
const { clients } = clientStore;

const isAddClientModalVisible = ref<boolean>(false);

const showAddClientModal = () => {
  isAddClientModalVisible.value = true;
};
</script>

<template>
  <v-card class="mx-auto">
    <v-card-item>
      <v-card-title class="d-flex justify-space-between">
        <span> Клиенты </span>
        <v-btn prepend-icon="$plus" variant="outlined" @click="showAddClientModal">
          Добавить клиента
        </v-btn>
      </v-card-title>

      <!--      <v-card-subtitle>-->
      <!--        Card subtitle secondary text-->
      <!--      </v-card-subtitle>-->
    </v-card-item>

    <v-card-text>
      <v-row>
        <v-col v-for="client in clients" :key="client._id" cols="4">
          <v-card :link="true" :hover="true" :to="{ name: 'client', params: { id: client._id } }">
            <v-card-title>
              <v-avatar v-if="client.photo">
                <v-img :alt="client.name" :src="client.photo" />
              </v-avatar>
              {{ client.name }}
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>

    <add-client-modal v-model="isAddClientModalVisible" />
  </v-card>
</template>
