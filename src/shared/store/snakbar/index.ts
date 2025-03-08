import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notification', () => {
  const message = ref('');
  const show = ref(false);
  const TIMEOUT = 3000;

  const toggle = (msg?: string) => {
    message.value = msg || '';
    show.value = Boolean(msg);
  };

  return {
    message,
    show,
    TIMEOUT,
    toggle,
  };
});
