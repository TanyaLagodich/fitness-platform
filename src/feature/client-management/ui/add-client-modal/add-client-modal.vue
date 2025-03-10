<script setup lang="ts">
import { ref } from 'vue';
import { useClientModel } from '@/feature/client-management';

const isShow = defineModel({ default: false });

const emits = defineEmits<{
  (e: 'update:model-value', value: boolean): void;
}>();

const clientModel = useClientModel();

const newClient = ref({
  name: '',
  email: '',
  notes: '',
});

const addNewClient = () => {
  clientModel.addNewClient(newClient.value);
  newClient.value = {
    name: '',
    email: '',
    notes: '',
  };

  emits('update:model-value', false);
};
</script>

<template>
  <v-dialog :model-value="isShow" max-width="600">
    <v-card prepend-icon="mdi-account" title="Новый клиент">
      <v-card-text>
        <v-text-field label="Имя" v-model="newClient.name" />

        <v-text-field label="Email" v-model="newClient.email" type="email" />

        <v-textarea label="Заметки" v-model="newClient.notes" />
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text="Close" variant="plain" @click="$emit('update:model-value', false)" />

        <v-btn color="primary" text="Save" variant="tonal" @click="addNewClient" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
