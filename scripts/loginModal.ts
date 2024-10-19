import { ref } from 'vue'

export const showLoginModal = ref(false)

export function toggleLoginModal() {
  showLoginModal.value = !showLoginModal.value
}

export function closeLoginModal() {
  showLoginModal.value = false;
}