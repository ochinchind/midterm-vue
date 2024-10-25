<template>
    <div
        v-if="visible"
        :class="notificationClasses"
        class="fixed bottom-4 right-4 text-white rounded-lg shadow-lg p-4 w-64 transition-opacity duration-500 ease-in-out opacity-0"
    >
        <p class="text-sm">{{ message }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';

const props = defineProps<{ message: string; type?: 'success' | 'danger' | 'info' }>();

const visible = ref(false);

const notificationClasses = computed(() => {
    switch (props.type) {
        case 'success':
            return 'bg-green-500 opacity-100';
        case 'danger':
            return 'bg-red-500 opacity-100';
        default:
            return 'bg-blue-500 opacity-100';
    }
});

const showNotification = () => {
    visible.value = true;
    setTimeout(() => {
        visible.value = false;
    }, 5000);
};

watchEffect(() => {
    if (props.message) showNotification();
});
</script>