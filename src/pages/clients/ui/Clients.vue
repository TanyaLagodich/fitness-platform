<script setup lang="ts">
import { ref } from 'vue';
import AddClientModal from "@/feature/client-management/ui/AddClientModal.vue";
import { useClientStore } from '@/feature/client-management/model/clientStore.ts';

const clientStore = useClientStore();
const { clients } = clientStore;
// const clients = ref([
//   {
//     "_id": "674893395c9b6d00155f2952",
//     "subscription": {
//       "available_tariffs": []
//     },
//     "bio": {
//       "fullname": "Марина Ржевская",
//       "firstName": "Марина",
//       "secondName": "Ржевская",
//       "gender": "female",
//       "profilePicURL": "https://bn-pics.s3.eu-west-3.amazonaws.com/photo-perfil-1-min.jpg",
//       "birthday": "1996-06-17T00:00:00.000Z",
//       "username": "",
//       "notes": "Она любит рыбу, часто путешествует и имеет некоторые проблемы со спиной. Ей нужны короткие, но эффективные тренировки."
//     },
//     "email": "marina.rjevskaia+1833@befitpro.ru",
//     "creationDate": "2024-11-19T10:36:18.433Z",
//     "uid": "demo-9cc81637-28d8-47af-8740-e2572dc3d6fa",
//     "coachUid": "7MoHNIZ5phhRJIEGzaUdQU1PWr93",
//     "phone": "+34698997177",
//     "lastWorkoutPlannedDate": "2023-08-07T22:00:00.000Z",
//     "isDemo": true,
//     "status": "AVAILABLE"
//   },
//   {
//     "_id": "674893395c9b6d00155f295c",
//     "subscription": {
//       "available_tariffs": []
//     },
//     "bio": {
//       "fullname": "Сергей Черкасов",
//       "firstName": "Сергей",
//       "secondName": "Черкасов",
//       "gender": "male",
//       "profilePicURL": "https://bn-pics.s3.eu-west-3.amazonaws.com/photo-perfil-2-min.jpg",
//       "birthday": "1978-03-22T00:00:00.000Z",
//       "username": "",
//       "notes": "Preferencias alimentarias específicas, estilo de vida sedentario debido al trabajo de oficina, horarios convenientes para el entrenamiento durante la hora de almuerzo o después del trabajo.\n\nRamón está ocupado en su trabajo, por lo que cancela los entrenamientos con frecuencia. Necesito reducir el tiempo de entrenamiento y programar solo 2 de las 3 sesiones de entrenamiento por semana para él."
//     },
//     "email": "sergei.cherkasov+1833@befitpro.ru",
//     "creationDate": "2024-11-14T10:36:45.440Z",
//     "uid": "demo-3521e8ce-b90a-4048-8e50-072fa97630e5",
//     "coachUid": "7MoHNIZ5phhRJIEGzaUdQU1PWr93",
//     "lastWorkoutPlannedDate": "2023-08-07T22:00:00.000Z",
//     "phone": "+34698997177",
//     "isDemo": true,
//     "deactivationDate": null,
//     "isDisabled": false,
//     "status": "AVAILABLE"
//   }
// ]);

const isAddClientModalVisible = ref<boolean>(false);

const showAddClientModal = () => {
  isAddClientModalVisible.value = true;
}
</script>

<template>
  <v-card
      class="mx-auto"
  >
    <v-card-item>
      <v-card-title
        class="d-flex justify-space-between"
      >
        <span>
          Клиенты
        </span>
        <v-btn
            prepend-icon="$plus"
            variant="outlined"
            @click="showAddClientModal"
        >
          Добавить клиента
        </v-btn>
      </v-card-title>

<!--      <v-card-subtitle>-->
<!--        Card subtitle secondary text-->
<!--      </v-card-subtitle>-->
    </v-card-item>

    <v-card-text>
      <v-row>
        <v-col
            v-for="client in clients"
            :key="client.id"
            cols="4"
        >
          <v-card
              :link="true"
              :hover="true"
              :to="{ name: 'client', params: { id: client.id }}"
          >
            <v-card-title>
              <v-avatar v-if="client.profilePicURL">
                <v-img
                    :alt="client.name"
                    :src="client.profilePicURL"
                />
              </v-avatar>
              {{ client.name }}
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>

    <add-client-modal
      v-model="isAddClientModalVisible"
    />

  </v-card>
</template>
