<script setup lang="ts">

import { useRouter } from 'vue-router'
import { object, string, type InferType } from 'yup'
import type { FormError, FormErrorEvent, FormSubmitEvent } from '#ui/types'
import { showLoginModal, toggleLoginModal } from '~/scripts/loginModal'


const router = useRouter()

function goToProductsPage() {
  router.push('/products') 
}

const schemaLogin = object({
  username: string().required('Username is required').max(255, 'Maximum 255 characters'),
  password: string()
    .min(8, 'Must be at least 8 characters')
    .required('Password is required')
})

type SchemaLoginType = InferType<typeof schemaLogin>

const stateLogin = reactive({
  username: undefined,
  password: undefined
})


</script>

<script lang="ts">

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      showModalLogin: false,
      isOpenAuth: false,
      isAuth: false,
      authUserId: '' as null|string,
    };
  },
  computed: {

  },
  mounted() {
    var isAuthValue = localStorage.getItem('isAuth');
    this.authUserId = isAuthValue;

    this.isAuth = isAuthValue !== null && !isNaN(Number(isAuthValue));
  },
  beforeUnmount() {

  },
  methods: {
    async LoginSubmit(event: FormSubmitEvent<SchemaLoginType>) {
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
                alert('Logged successful!');
                localStorage.setItem('isAuth', result.userId);
                this.isAuth = true;
                this.authUserId = result.userId;
            } else {
                alert('Failed to login.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred while submitting the form.');
        }
    },
    toggleModalLogin(event: any) {
      event.preventDefault();
      this.showModalLogin = !this.showModalLogin;
    },
    closeModalLogin() {
      this.showModalLogin = false;
    },
    logout() {
      localStorage.removeItem('isAuth');
      this.isAuth = false;
    }
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
</style>

<template>
    <div v-show="showLoginModal" class="modal" @click.self="closeModalLogin">
      <div class="modal-content">
        <span class="close" @click="closeModalLogin">&times;</span>
        <h2 style="text-align: center;
    color: white;
    padding: 20px;
    margin: 0;" class="bg-gray-300">Login</h2>
        <div class="modal-body" style=" text-align: center;   padding: 20px;
    margin-top: 3rem;
    margin-bottom: 3rem;">
          <UForm @submit="LoginSubmit" :schema="schemaLogin" :state="stateLogin" >
            <UFormGroup label="Username" name="username">
                <UInput class="bg-white black" v-model="stateLogin.username" type="text" placeholder="Enter username" />
            </UFormGroup>
            <UFormGroup label="Password" name="password">
                <UInput class="bg-white black" v-model="stateLogin.password" type="password" placeholder="Enter password" />
            </UFormGroup>
            <div class="mt-2">
                <UButton type="submit" class="btn btn-orange bg-orange-200">
                    Login
                </UButton>
            </div>
          </UForm>
        </div>
      </div>
    </div>


    <main>
    <section >
      <div class="container flex flex-col lg:flex-row items-center py-20 gap-10">
        <div class="flex-1 order-2 lg:order-1 text-center lg:text-left">
          <h1 class="text-4xl lg:text-6xl font-extrabold mb-6 text-balance">
            Luxury sneakers Unleash your potential!
          </h1>
          <p class="text-xl lg:text-2xl mb-8 text-balance">
            Discover sneakers that will lead you to success
          </p>
          <button
          class="px-4 py-2 self-start bg-orange-200 rounded-md text-lg cursor-pointer btn-orange"
          @click="goToProductsPage"
        >
          Browse Sneakers
        </button>
        </div>
        <div class="flex-1 order-1 lg:order-2">
          <NuxtImg
            class="w-100"
            src="/sneakers.webp"
            alt="Sneakers shop"
          />
        </div>
      </div>
    </section>
    
  </main>
</template>