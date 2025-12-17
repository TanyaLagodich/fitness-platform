import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notification', () => {
  const message = ref('');
  const show = ref(false);
  const TIMEOUT = 3000;
  const severity = ref<'info' | 'success' | 'error'>('info');

  const toggle = (msg?: string, type: 'info' | 'success' | 'error' = 'info') => {
    message.value = msg || '';
    severity.value = type;
    show.value = Boolean(msg);
  };

  return {
    message,
    show,
    TIMEOUT,
    severity,
    toggle,
  };
});
