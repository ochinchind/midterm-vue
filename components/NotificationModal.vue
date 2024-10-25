<template>
    <div
        v-if="visible"
        :class="['fixed bottom-4 right-4 text-white rounded-lg shadow-lg p-4 w-64 transition-opacity duration-500 ease-in-out', notificationClasses]"
    >
        <p class="text-sm">{{ message }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';

const props = defineProps<{ message: string; type?: 'success' | 'danger' | 'info' }>();

const visible = ref(false);

const notificationClasses = computed(() => {
    return {
        'bg-green-500': props.type === 'success',
        'bg-red-500': props.type === 'danger',
        'bg-blue-500': !props.type || props.type === 'info',
        'opacity-100': visible.value,
        'opacity-0': !visible.value
    };
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
