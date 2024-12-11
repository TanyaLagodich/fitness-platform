<script lang="ts" setup>
import { ref } from 'vue';
import { Client } from '@/shared/types';
import { useClientStore } from '../model/clientStore.ts';

const props = defineProps<{ modelValue: boolean }>();
const emits = defineEmits<{(e: 'update:modelValue', client: Client): void
}>();

const clientStore = useClientStore();

const newClient = ref<Client>({
  name: '',
  email: '',
  notes: '',
});

const addNewClient = async () => {
  try {
    await clientStore.addNewClient(newClient.value);
    resetNewClientFields();
    emits('update:modelValue', false);
  } catch (err) {
    console.error(err);
  }
}

const resetNewClientFields  = () => {
  newClient.value.name = '';
  newClient.value.email = '';
  newClient.value.notes = '';
}
</script>

<template>
  <v-dialog
      :model-value="modelValue"
      max-width="600"
  >
    <v-card
        prepend-icon="mdi-account"
        title="Новый клиент"
    >
      <v-card-text>

        <v-text-field
            label="Имя"
          v-model="newClient.name"
        />

        <v-text-field
            label="Email"
          v-model="newClient.email"
            type="email"
        />

        <v-textarea
            label="Заметки"
          v-model="newClient.notes"
        />
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
            text="Close"
            variant="plain"
            @click="emits('update:modelValue', false)"
        />

        <v-btn
            color="primary"
            text="Save"
            variant="tonal"
            @click="addNewClient"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
