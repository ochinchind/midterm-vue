import NotificationModal from '@/components/NotificationModal.vue';
import { ref } from 'vue';

export const notificationMessage = ref('');
export const notificationType = ref<'success' | 'danger' | 'info'>('info');

export const notifyUser = (message: string, type: 'success' | 'danger' | 'info' = 'info') => {
    notificationMessage.value = message;
    notificationType.value = type;
};

watch(notificationMessage, (newValue) => {
    if (newValue) {
        setTimeout(() => {
            notificationMessage.value = '';
        }, 5000);
    }
});