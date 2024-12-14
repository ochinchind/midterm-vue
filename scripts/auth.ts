import { ref } from 'vue'
import { object, string, type InferType } from 'yup'
import type { FormError, FormErrorEvent, FormSubmitEvent } from '#ui/types'
import { notifyUser, notificationMessage } from '~/scripts/notifications'

export const isAuth = ref(false)
export const authUserId = ref('')
export const authJwtToken = ref('')

function setCookie(name: any, value: any, days = 7) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000)); // default expiry 7 days
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;SameSite=Strict`;
}

function getCookie(name: any) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const part = parts.pop();
        if (part) {
            return part.split(';').shift();
        }
    }
    return null;
}

function deleteCookie(name: any) {
    document.cookie = `${name}=; Max-Age=-99999999; path=/; secure; SameSite=Strict`;
}
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

export function authJwtTokenChange(val: string) {
    authJwtToken.value = val;
}

export function logout() {
    localStorage.removeItem('isAuth');
    localStorage.removeItem('jwtToken');
    deleteCookie('jwtToken');
    changeIsAuth(false);
    notifyUser('Logged out!');
    window.location.reload();
}

export const showForgetPasswordModal = ref(false)

export function toggleForgetPasswordModal() {
  showForgetPasswordModal.value = !showForgetPasswordModal.value
}

export function closeForgetPasswordModal() {
  showForgetPasswordModal.value = false;
}

export const isLoadingForgetPassword = ref(false);

export async function sendForgetPasswordToEmail() {
    const emailForgetInput = document.getElementById('emailForgetInput') as HTMLInputElement;
    const email = emailForgetInput.value;
    emailForgetInput.disabled = true;
    isLoadingForgetPassword.value = true;

    try {
        const response = await fetch('/api/sendforgetpassword', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: email}),
        });

        const result = await response.json();
        if (result.success) {
            alert('Send successfuly!');

        } else {
            alert('Failed to send.');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred while submitting the form.');
    } finally {
        emailForgetInput.disabled = false;
        isLoadingForgetPassword.value = false;
    }
}

export const isLoadingForgetChangePassword = ref(false);

export async function changePasswordForget() {
    const emailForgetInput = document.getElementById('emailForgetInput') as HTMLInputElement;
    const email = emailForgetInput.value;
    const secretPhraseForgetPasswordInput = document.getElementById('secretPhraseForgetPasswordInput') as HTMLInputElement;
    const secretPhrase = secretPhraseForgetPasswordInput.value;
    const newPasswordInputForget = document.getElementById('newPasswordInputForget') as HTMLInputElement;
    const newPassword = newPasswordInputForget.value;

    emailForgetInput.disabled = true;
    isLoadingForgetChangePassword.value = true;

    try {
        const response = await fetch('/api/userchangeforgetpassword', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: email, secretPhrase: secretPhrase, newPassword: newPassword}),
        });

        const result = await response.json();
        if (result.success) {
            alert('Changed successfully!');
            closeForgetPasswordModal();
        } else {
            alert('Failed to change.');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred while submitting the form.');
    } finally {
        emailForgetInput.disabled = false;
        isLoadingForgetChangePassword.value = false;
    }
}

export async function SendLastActivity() {
    try {
        const response = await fetch('/api/sendlastactivity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authJwtToken.value,
            },
        });

        const result = await response.json();
        if (result.success) {
            console.log('send last activity');
        } else {
            alert('Failed to send last activity.');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred while submitting the form.');
    } finally {

    }
}

export const schemaLogin = object({
    username: string().required('Username is required').max(255, 'Maximum 255 characters'),
    password: string()
      .required('Password is required')
  })
  
export type SchemaLoginType = InferType<typeof schemaLogin>
  
export const stateLogin = reactive({
    username: undefined,
    password: undefined
})

export async function LoginSubmit(event: FormSubmitEvent<SchemaLoginType>) {
    event.preventDefault();

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(event.data),
        });

        const result = await response.json();
        if (result.success) {
            notifyUser('Logged successful!', 'success');
            localStorage.setItem('isAuth', result.userId);
            localStorage.setItem('jwtToken', result.token);
            setCookie('jwtToken', result.token);
            trueIsAuth();
            authUserIdChange(result.userId);
            authJwtTokenChange(result.token);
            closeLoginModal();
        } else {
            notifyUser('Failed to login.');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred while submitting the form.');
    }
}


export const schemaRegister = object({
    email: string().required('Email is required').email(),
    username: string().required('Username is required').max(255, 'Maximum 255 characters'),
    password: string()
      .min(8, 'Must be at least 8 characters')
      .required('Password is required')
  })
  
export type SchemaRegisterType = InferType<typeof schemaRegister>
  
export const stateRegister = reactive({
    email: undefined,
    username: undefined,
    password: undefined
})

export async function RegisterSubmit(event: FormSubmitEvent<SchemaRegisterType>) {
    event.preventDefault();

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event.data),
        });

        const result = await response.json();
        if (result.success) {
            notifyUser('Registered successful! Please verify your email in profile!');
            localStorage.setItem('isAuth', result.userId);
            localStorage.setItem('jwtToken', result.token);
            setCookie('jwtToken', result.token);
            trueIsAuth();
            authUserIdChange(result.userId);
            authJwtTokenChange(result.token);
            closeRegisterModal();
        } else {
            notifyUser('Failed to register: ' + result.message);
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred while submitting the form.');
    }
}

export const showLoginModal = ref(false)

export function toggleLoginModal() {
  showLoginModal.value = !showLoginModal.value
}

export function closeLoginModal() {
  showLoginModal.value = false;
}

export const showRegisterModal = ref(false)

export function toggleRegisterModal() {
  showRegisterModal.value = !showRegisterModal.value
}

export function closeRegisterModal() {
  showRegisterModal.value = false;
}

