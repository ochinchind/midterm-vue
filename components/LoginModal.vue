<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormError, FormErrorEvent, FormSubmitEvent } from '#ui/types'



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
      isAuth: false,
      authUserId: '' as null|string,
    };
  },
  computed: {

  },
  mounted() {

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
  }
}
</script>

<template>
    <div v-show="showModalLogin" class="modal" @click.self="closeModalLogin">
      <div class="modal-content">
        <span class="close" @click="closeModalLogin">&times;</span>
        <h2 style="text-align: center;
    color: white;
    padding: 20px;
    background: #75C2FA;
    margin: 0;">Login</h2>
        <div class="modal-body" style=" text-align: center;   padding: 20px;
    margin-top: 3rem;
    margin-bottom: 3rem;">
          <UForm @submit="LoginSubmit" :schema="schemaLogin" :state="stateLogin" >
            <UFormGroup label="Username" name="username">
                <UInput style="background: white; color: black; font-size: 2rem;" v-model="stateLogin.username" type="text" placeholder="Enter username" />
            </UFormGroup>
            <UFormGroup label="Password" name="password">
                <UInput style="background: white; color: black; font-size: 2rem;" v-model="stateLogin.password" type="password" placeholder="Enter password" />
            </UFormGroup>
            <div style="margin-top: 2rem;">
              <button type="button" style="background: white; font-size: 1rem; color: black; border: 1px black solid; padding: 1.5rem;">FORGOT PASSWORD?</button>
            </div>
            <div style="margin-top: 2rem;">
                <UButton type="submit" style="background: lime; padding: 2rem; border-radius: 2rem;">
                    AUTHORIZE
                </UButton>
            </div>
          </UForm>
        </div>
      </div>
    </div>
</template>