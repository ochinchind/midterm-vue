<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { object, string, type InferType } from 'yup';
import type { User } from '@/types/types';

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
  const isAuthValue = localStorage.getItem('isAuth');

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
    const res = await fetch(`/api/updateUser/${user.value?.id}`, { // Adjust the endpoint as needed
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        id: user.value?.id,
        username: formState.username, 
        email: formState.email, 
        password: formState.password 
      }),
    });

    const result = await res.json();
    if (result.success) {
      alert('User updated successfully!');
      if (user.value) 
      user.value = { ...user.value, ...formState }; // Update local user state
    } else {
      alert('Failed to update user.');
    }
  } catch (error) {
    console.error('Error updating user data:', error);
    alert('An error occurred while updating the user.');
  }
}

</script>

<style>
.w-100 {
    width: 100%;
}

.btn-orange:hover{
    background-color: rgb(251 146 60);
}

.modal {
  display: block; /* Show the modal */
  position: fixed; 
  z-index: 1; 
  left: 0;
  top: 0;
  width: 100%; 
  height: 100%; 
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  background-color: #fff;
  margin: 15% auto;
  border: 1px solid #888;
  width: 80%;
  max-width: 400px;
  border-radius: 8px;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: black;
}
</style>

<style scoped>
.profile-form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
}

input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

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
<main>
<section class="mt-20">
    <div>
    <h1>User Profile</h1>
    <div v-if="user">
        <form @submit.prevent="updateUser" class="profile-form">
        <div class="form-group">
            <label for="username">Username:</label>
            <input type="text" id="username" v-model="formState.username" required />
        </div>
        <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="formState.email" required />
        </div>
        <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="formState.password" />
        </div>
        <button type="submit" class="btn-orange">Update Profile</button>
        </form>
        <div class="user-details">
        <h2>Current User Details:</h2>
        <p><strong>ID:</strong> {{ user.id }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Username:</strong> {{ user.username }}</p>
        </div>
    </div>
    <div v-else>
        <p>Loading user data...</p>
    </div>
    </div>
</section>
</main>
</template>
  