<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { object, string, type InferType } from 'yup';
import type { User } from '@/types/types';
import { isAuth, authUserId, authJwtToken, trueIsAuth, toggleIsAuth, changeIsAuth, falseIsAuth, authUserIdChange, authJwtTokenChange, logout, showForgetPasswordModal, toggleForgetPasswordModal, closeForgetPasswordModal, isLoadingForgetPassword, sendForgetPasswordToEmail, isLoadingForgetChangePassword, changePasswordForget, SendLastActivity, LoginSubmit, schemaLogin, stateLogin, RegisterSubmit, schemaRegister, stateRegister, showLoginModal, toggleLoginModal, closeLoginModal, showRegisterModal, toggleRegisterModal, closeRegisterModal } from '~/scripts/auth'
import { notifyUser, notificationMessage } from '~/scripts/notifications'

const router = useRouter();
const route = useRoute();

const user = ref<User | null>(null);

const schema = object({
  username: string().required('Username is required').max(255, 'Maximum 255 characters'),
  email: string().email('Invalid email').required('Email is required'),
  password: string().min(8, 'Must be at least 8 characters'),
});

type SchemaType = InferType<typeof schema>;

const formState = reactive<SchemaType>({
  username: '',
  email: '',
  password: '',
});

onMounted(async () => {
    var isAuthValue = localStorage.getItem('isAuth');
    var authJwtTokenValue = localStorage.getItem('jwtToken');
    authUserIdChange(isAuthValue ?? '');
    changeIsAuth(isAuthValue !== null && !isNaN(Number(isAuthValue)));
    authJwtTokenChange(authJwtTokenValue ?? '');
    if (authJwtToken !== null) {
        SendLastActivity();
    }

    if (!isAuthValue || isNaN(Number(isAuthValue))) {
      router.push('/');
    } else {
      await fetchUserData(isAuthValue);
    }
});

async function fetchUserData(id: string) {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error('Failed to fetch user');

    const userData = await res.json();
    user.value = userData.user;

    if (user.value) {
      formState.username = user.value.username;
      formState.email = user.value.email;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}

async function updateUser() {
  try {
    const res = await fetch(`/api/updateUser`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authJwtToken.value
      },
      body: JSON.stringify({
        username: formState.username, 
        email: formState.email, 
        password: formState.password 
      }),
    });

    const result = await res.json();
    if (result.success) {
      notifyUser('User updated successfully!', 'success');
      if (user.value) 
      user.value = { ...user.value, ...formState };
    } else {
      notifyUser('Failed to update user.', 'danger');
    }
  } catch (error) {
    console.error('Error updating user data:', error);
    alert('An error occurred while updating the user.');
  }
}

const schemaSubmitCode = object({
  activationCode: string().required('Submit code is required!').max(255, 'Maximum 255 characters'),
});

type SchemaSubmitCodeType = InferType<typeof schemaSubmitCode>;

const formStateSubmitCode = reactive<SchemaSubmitCodeType>({
  activationCode: '',
});

const isSendingCode = ref(false);
const isSubmittingCode = ref(false);
const isUpdating = ref(false);

const sendCode = async () => {
  isSendingCode.value = true;
  try {
    const response = await fetch('/api/sendusercode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authJwtToken.value,
      },
    });

    const result = await response.json();
    if (result.success) {
      notifyUser('Send successfully!', 'success');
    } else {
      notifyUser('Activation code not sent: ' + result.message, 'danger');
    }
  } catch (error) {
    console.error('Error sending code:', error);
    notifyUser('An error occurred while sending the code.', 'danger');
  } finally {
    isSendingCode.value = false;
  }
};

const submitCode = async (event: any) => {
  event.preventDefault();
  isSubmittingCode.value = true;
  try {
    const response = await fetch('/api/validateemail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authJwtToken.value,
      },
      body: JSON.stringify({ code: formStateSubmitCode.activationCode }),
    });

    const result = await response.json();
    if (result.success) {
      notifyUser('Account activated!', 'success');
      user.value.activated = true;
    } else {
      notifyUser('Invalid activation code', 'danger');
    }
  } catch (error) {
    notifyUser('Error submitting code', 'danger');
  } finally {
    isSubmittingCode.value = false;
  }
};

</script>

<style>
.w-100 {
    width: 100%;
}

.btn-orange:hover{
    background-color: rgb(251 146 60);
}

</style>

<style scoped>

.btn-orange {
  padding: 10px;
  background-color: rgb(251, 146, 60);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-orange:hover {
  background-color: rgb(233, 126, 40);
}

.user-details {
  margin-top: 20px;
}
</style>
<template>
  <NotificationModal :message="notificationMessage" />

  <main class="bg-gray-100 min-h-screen py-10 mt-20">
    <section class="container mx-auto p-6 max-w-lg bg-white rounded-lg shadow-md">
      <h1 class="text-3xl font-semibold text-orange-500 mb-6 text-center">User Profile</h1>
      
      <div v-if="user">
        <UForm @submit="updateUser" :schema="schema" :state="formState" class="space-y-4">
          <UFormGroup label="Email" name="email">
            <UInput
              v-model="formState.email"
              type="email"
              placeholder="Enter email"
              class="w-full p-3 bg-gray-100 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </UFormGroup>
          
          <UFormGroup label="Username" name="username">
            <UInput
              v-model="formState.username"
              type="text"
              placeholder="Enter username"
              class="w-full p-3 bg-gray-100 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </UFormGroup>

          <!-- Password Field -->
          <UFormGroup label="Password" name="password">
            <UInput
              v-model="formState.password"
              type="password"
              placeholder="Enter password"
              class="w-full p-3 bg-gray-100 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </UFormGroup>

          <!-- Submit Button -->
          <div class="text-center mt-6">
            <UButton
              type="submit"
              class="w-full py-3 text-white font-semibold bg-orange-500 rounded-md shadow hover:bg-orange-600 transition duration-300"
            >
              Edit
            </UButton>
          </div>
        </UForm>

        <!-- User Activation Section -->
        <div v-if="!user.activated" class="mt-8 p-6 bg-orange-100 rounded-lg shadow-inner text-gray-700">
          <h2 class="text-xl font-semibold text-orange-500 mb-4">Activate Your Account</h2>
          <button
            @click="sendCode"
            :disabled="isSendingCode"
            class="w-full mb-4 py-2 bg-orange-500 text-white rounded-md shadow hover:bg-orange-600 transition duration-300 flex items-center justify-center"
          >
            <div v-if="isSendingCode" class="w-5 h-5 mr-2 border-4 border-t-orange-500 border-orange-200 rounded-full animate-spin"></div>
            <span v-if="!isSendingCode">Send Code</span>
            <span v-else>Loading...</span>
          </button>
          
          <UForm @submit="submitCode"  :schema="schemaSubmitCode" :state="formStateSubmitCode" class="space-y-4">
            <UFormGroup label="Enter Activation Code" name="activationCode">
              <UInput
                v-model="formStateSubmitCode.activationCode"
                type="text"
                placeholder="Enter the code here"
                class="w-full p-3 bg-gray-100 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </UFormGroup>
            <div class="text-center">
              <UButton
              :disabled="isSubmittingCode"
                type="submit"
                class="w-full py-2 text-white font-semibold bg-orange-500 rounded-md shadow hover:bg-orange-600 transition duration-300 flex items-center justify-center"
              >
              <div v-if="isSubmittingCode" class="w-5 h-5 mr-2 border-4 border-t-orange-500 border-orange-200 rounded-full animate-spin"></div>
              <span v-if="!isSubmittingCode">Submit</span>
              <span v-else>Loading...</span>
              </UButton>
            </div>
          </UForm>
        </div>

        <!-- User Details -->
        <div class="mt-10 p-6 bg-gray-50 rounded-lg shadow-inner text-gray-700">
          <h2 class="text-xl font-semibold text-orange-500 mb-4">Current User Details</h2>
          <p><strong>ID:</strong> {{ user.id }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Username:</strong> {{ user.username }}</p>
          <p><strong>Activated:</strong> {{ user.activated ? 'Yes' : 'No' }}</p>
        </div>
      </div>

      <div v-else class="text-center py-6 text-gray-500">
        <p>Loading user data...</p>
      </div>
    </section>
  </main>
</template>
