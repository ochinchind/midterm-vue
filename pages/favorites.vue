<template>
    <NotificationModal :message="notificationMessage" />



<div v-show="showLoginModal" class="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50" @click.self="closeLoginModal">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
            <button @click="closeLoginModal" class="text-white text-2xl absolute top-4 right-4">&times;</button>
            <h2 class="text-center text-dark text-2xl font-semibold mb-6 bg-gray-100 p-4 rounded-t-lg">Login</h2>
            <div class="modal-body text-center p-6">
                <UForm @submit="LoginSubmit" :schema="schemaLogin" :state="stateLogin">
                    <UFormGroup label="Username" name="username" class="mb-4">
                        <UInput class="w-full p-2 text-black bg-white border border-gray-100 rounded-md" v-model="stateLogin.username" type="text" placeholder="Enter username" />
                    </UFormGroup>
                    <UFormGroup label="Password" name="password" class="mb-4">
                        <UInput class="w-full p-2 text-black bg-white border border-gray-100 rounded-md" v-model="stateLogin.password" type="password" placeholder="Enter password" />
                    </UFormGroup>
                    <div class="mt-4">
                        <UButton type="submit" class="w-full py-2 text-white bg-orange-500 hover:bg-orange-600 rounded-md">
                            Login
                        </UButton>
                    </div>
                </UForm>
            </div>
        </div>
    </div>
    <div v-show="showRegisterModal" class="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50" @click.self="closeRegisterModal">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md ">
            <button @click="closeRegisterModal" class="text-white text-2xl absolute top-4 right-4">&times;</button>
            <h2 class="text-center text-dark text-2xl font-semibold mb-6 bg-gray-100 p-4 rounded-t-lg">Register</h2>
            <div class="modal-body text-center p-6">
                <UForm @submit="RegisterSubmit" :schema="schemaRegister" :state="stateRegister">
                  <UFormGroup label="Email" name="email" class="mb-4">
                        <UInput class="w-full p-2 text-black bg-white border border-gray-100 rounded-md" v-model="stateRegister.email" type="email" placeholder="Enter email" />
                    </UFormGroup>
                    <UFormGroup label="Username" name="username" class="mb-4">
                        <UInput class="w-full p-2 text-black bg-white border border-gray-100 rounded-md" v-model="stateRegister.username" type="text" placeholder="Enter username" />
                    </UFormGroup>
                    <UFormGroup label="Password" name="password" class="mb-4">
                        <UInput class="w-full p-2 text-black bg-white border border-gray-100 rounded-md" v-model="stateRegister.password" type="password" placeholder="Enter password" />
                    </UFormGroup>
                    <div class="mt-4">
                        <UButton type="submit" class="w-full py-2 text-white bg-orange-500 hover:bg-orange-600 rounded-md">
                            Register
                        </UButton>
                    </div>
                </UForm>
            </div>
        </div>
    </div>


    <div class="p-8 bg-gray-100 min-h-screen mt-6">
      <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">Your Favorites List</h1>
  
      <div v-if="ProductDetails && ProductDetails.length > 0" class="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div class="space-y-6">
            <div
                v-for="item in ProductDetails"
                :key="item.id"
                class="flex justify-between items-center border-b pb-4 mb-4"
            >
                <NuxtLink :to="`/product/${item.product_id}`" class="flex items-center space-x-4">
                <img :src="item.image_url" alt="Product Image" class="w-20 h-20 object-cover rounded-lg shadow-md" />
                <div>
                    <h2 class="text-xl font-semibold text-gray-800">{{ item.name }}</h2>
                    <p class="text-gray-600">Price: ${{ item.price }}</p>
                </div>
                </NuxtLink>

                <button @click="removeFromCart(item)" class="text-red-500 hover:text-red-700 font-semibold">
                    Remove
                </button>
                </div>
            </div>
        </div>
      
        <div v-else class="text-center text-lg font-semibold text-gray-500 mt-20">
            Your favorites is empty. <router-link to="/products" class="text-blue-500 hover:underline">Take a look at our offers</router-link>
        </div>
    </div>
  </template>
  
  <script setup lang="ts">
    import { useRoute } from 'vue-router'
    import { ref, onMounted } from 'vue'
    import { object, string, type InferType, ValidationError } from 'yup'
    import type { FormError, FormErrorEvent, FormSubmitEvent } from '#ui/types'
    import { isAuth, authUserId, authJwtToken, trueIsAuth, toggleIsAuth, changeIsAuth, falseIsAuth, authUserIdChange, authJwtTokenChange, logout, showForgetPasswordModal, toggleForgetPasswordModal, closeForgetPasswordModal, isLoadingForgetPassword, sendForgetPasswordToEmail, isLoadingForgetChangePassword, changePasswordForget, SendLastActivity, LoginSubmit, schemaLogin, stateLogin, RegisterSubmit, schemaRegister, stateRegister, showLoginModal, toggleLoginModal, closeLoginModal, showRegisterModal, toggleRegisterModal, closeRegisterModal } from '~/scripts/auth'
    import { notifyUser, notificationMessage } from '~/scripts/notifications'
    import { type Product, type Category, type ProductDetail } from '~/types/types';
    import { getStarStyle } from '~/scripts/getStarStyle'
    import { formatDistanceToNow } from 'date-fns'

    const router = useRouter();
    const ProductDetails = ref<ProductDetail[] | null>(null);

    const fetchProductDetails = () => {
        const rawCartData = localStorage.getItem('favs');
        if (rawCartData) {
            const parsedCart = JSON.parse(rawCartData);

            const transformedCart: ProductDetail[] = parsedCart.map((item: any) => ({
                id: item.id,
                product_id: item.id, // Default product_id to id
                name: item.name,
                price: item.price || 0, // Default price to 0 if not provided
                quantity: item.quantity || 1, // Default quantity to 1
                description: item.description,
                rating: item.rating,
                image_url: item.image_url ?? item.photos[0],
                category_name: item.category_name,
                photos: item.photos,
                reviews: item.reviews,
                isInCart: item.isInCart,
                isInFavorites: item.isInFavorites,
            }));

            ProductDetails.value = transformedCart;
        } else {
            ProductDetails.value = [];
        }
    };

    const saveCartToLocalStorage = () => {
    try {
        localStorage.setItem('favs', JSON.stringify(ProductDetails.value));
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
        notifyUser('Failed to save cart items', 'danger');
    }
    };

    const removeFromCart = (item: ProductDetail) => {
    try {
        ProductDetails.value = ProductDetails.value?.filter(ProductDetail => ProductDetail.id !== item.id) || [];
        saveCartToLocalStorage();
        notifyUser('Item removed from favs', 'success');
    } catch (error) {
        console.error('Error removing item from favs:', error);
        notifyUser('Failed to remove item', 'danger');
    }
    };

    onMounted(() => {
        fetchProductDetails();
    });

    onMounted(async () => {
        var isAuthValue = localStorage.getItem('isAuth');
        var authJwtTokenValue = localStorage.getItem('jwtToken');
        authUserIdChange(isAuthValue ?? '');
        changeIsAuth(isAuthValue !== null && !isNaN(Number(isAuthValue)));
        authJwtTokenChange(authJwtTokenValue ?? '');
        if (authJwtToken.value !== null && authJwtToken.value !== '') {
            SendLastActivity();
            fetchProductDetails()
        }
    });
  </script>
  
  <style scoped>
  .mt-6 {
    margin-top: 6rem;
  }
  </style>
  