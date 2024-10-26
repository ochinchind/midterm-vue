<script setup lang="ts">
import { isAuth, authUserId, authJwtToken, trueIsAuth, toggleIsAuth, changeIsAuth, falseIsAuth, authUserIdChange, authJwtTokenChange, logout, showForgetPasswordModal, toggleForgetPasswordModal, closeForgetPasswordModal, isLoadingForgetPassword, sendForgetPasswordToEmail, isLoadingForgetChangePassword, changePasswordForget, SendLastActivity, showLoginModal, toggleLoginModal, closeLoginModal, showRegisterModal, toggleRegisterModal, closeRegisterModal } from '~/scripts/auth'
</script>

<style>
.btn-link:hover{
    background-color: rgb(254 215 170);
}
.btn-link-red:hover {
    background-color: red;
}
</style>

<template>
<header class="absolute inset-x-0 top-0 z-50">
    <UContainer>
    <nav class="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
      <div class="flex lg:flex-1">
        <NuxtLink to="/"  class="-m-1.5 p-1.5">
            <span class="sr-only">Sneaker Shop</span>
            <NuxtImg class="h-8 w-auto" src="/logo.png" alt="" />
        </NuxtLink>
      </div>
      <div class="flex lg:hidden">
        <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
          <span class="sr-only">Open main menu</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
      <div class="hidden lg:flex lg:gap-x-12">
        <NuxtLink to="/" class="text-sm font-semibold leading-6 text-gray-900 btn-link p-2">Home</NuxtLink>
        <NuxtLink to="/products" class="text-sm font-semibold leading-6 text-gray-900 btn-link p-2">Products</NuxtLink>
      </div>
      <div class="hidden lg:flex lg:flex-1 lg:justify-end">
        <button @click="toggleLoginModal" v-if="!isAuth" class="text-sm font-semibold leading-6 text-gray-900 btn-link p-2">Log in <span aria-hidden="true">&rarr;</span></button>
        <button @click="toggleRegisterModal" v-if="!isAuth" class="text-sm font-semibold leading-6 text-gray-900 btn-link p-2">Create account <span aria-hidden="true">&rarr;</span></button>
        <NuxtLink to="/profile" v-if="isAuth" class="text-sm font-semibold leading-6 text-gray-900 btn-link p-2 me-2">Profile<span aria-hidden="true">&rarr;</span></NuxtLink>
        <NuxtLink to="/cart" v-if="isAuth" class="text-sm font-semibold leading-6 text-gray-900 btn-link p-2 me-2">Cart</NuxtLink>
        <button @click="logout" v-if="isAuth" class="text-sm font-semibold leading-6 text-gray-900 btn-link-red p-2">Logout</button>
      </div>
    </nav>
    <div class="lg:hidden" role="dialog" aria-modal="true">
      <div class="fixed inset-0 z-50"></div>
      <div class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div class="flex items-center justify-between">
            <NuxtLink to="/"  class="-m-1.5 p-1.5">
                <span class="sr-only">Sneaker Shop</span>
                <NuxtImg class="h-8 w-auto" src="/logo.png" alt="" />
            </NuxtLink>
          <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700">
            <span class="sr-only">Close menu</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10">
            <div class="space-y-2 py-6">
              <NuxtLink to="/" class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 btn-link p-2">Home</NuxtLink>
            </div>
            <div class="py-6">
                <button @click="toggleLoginModal" v-if="!isAuth"  class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 btn-link p-2">Log in</button>
                <button @click="toggleRegisterModal" v-if="!isAuth"  class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 btn-link p-2">Create account</button>
                <NuxtLink to="/profile" v-if="isAuth" class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 btn-link p-2">Profile</NuxtLink>
                <NuxtLink to="/cart" v-if="isAuth" class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 btn-link p-2">Cart</NuxtLink>
                <button @click="logout" v-if="isAuth" class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 btn-link p-2">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </UContainer>
  </header>
</template>
