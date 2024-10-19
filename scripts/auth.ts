import { ref } from 'vue'

export const isAuth = ref(false)
export const authUserId = ref('')

export function toggleIsAuth() {
    isAuth.value = !isAuth.value
}

export function falseIsAuth() {
    isAuth.value = false;
}

export function trueIsAuth() {
    isAuth.value = true;
}

export function changeIsAuth(val: boolean) {
    isAuth.value = val;
}

export function authUserIdChange(val: string) {
    authUserId.value = val;
}

export function logout() {
    localStorage.removeItem('isAuth');
    changeIsAuth(false);
}