<script setup lang="ts">

const show = defineModel<boolean>();

defineEmits<{
  'update:modelValue': (value: boolean) => void,
}>();

const createExercise = () => {

};
</script>

<template>
  <v-dialog
    :model-value="show"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card
        max-width="800"
        min-width="800"
        class="align-self-center"
    >
      <div class="d-flex align-center justify-space-between px-4 py-4">
        <v-card-title>Добавить свое собственное упражнение</v-card-title>
      </div>

      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field
                label="Название упражнения"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-select
                label="Группа мышц"
                :items="['Грудь', 'Спина', 'Плечи', 'Ноги', 'Живот', 'Кардио']"
            />
          </v-col>
          <v-col col="6" class="d-flex">
            <v-checkbox
                label="Дома"
                value="home"
            />
            <v-checkbox
              label="В зале"
              value="gym"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-select
              label="Формат"
              :items="['Повторения', 'Время', 'Расстояние', 'Вес и повторения', 'Время и повторения', 'Время и расстояние']"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Ссылка на youtube/vimeo видео"
              placeholder="Вставьте URL-адрес видео"
              :persistent-hint="true"
              hint="На одной из этих платформ нажмите кнопку «Поделиться» в видео, затем скопируйте и вставьте ссылку в поле."
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-btn
              color="primary"
              @click="createExercise"
            >
              Создать упражнение
            </v-btn>
          </v-col>
        </v-row>

      </v-card-text>
    </v-card>
  </v-dialog>
</template>

