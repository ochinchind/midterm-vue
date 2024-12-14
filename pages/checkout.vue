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
    <div class="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">Checkout</h1>

      <!-- Display Cart Items -->
      <div class="mb-8">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">Your Cart</h2>
        <div v-if="cartItems && cartItems.length > 0" class="space-y-4">
          <div
            v-for="(item, index) in cartItems"
            :key="index"
            class="flex items-center justify-between p-4 bg-gray-100 rounded-md"
          >
            <img :src="item.image_url" alt="Product Image" class="w-16 h-16 rounded-md object-cover" />
            <div class="flex-1 ml-4">
              <h3 class="text-lg font-medium text-gray-800">{{ item.name }}</h3>
              <p class="text-sm text-gray-600">{{ item.description }}</p>
            </div>
            <div class="text-right">
              <p class="text-lg font-semibold text-gray-800">${{ item.price.toFixed(2) }}</p>
              <p class="text-sm text-gray-600">Quantity: {{ item.quantity }}</p>
            </div>
          </div>
        </div>
        <div v-else class="text-gray-600 text-center">
          Your cart is empty.
        </div>
      </div>

      <!-- Checkout Form -->
      <UForm @submit="handleCheckout" :schema="schemaCheckout" :state="stateCheckout">
        <!-- Full Name -->
        <UFormGroup label="Full Name" name="fullName" class="mb-4">
          <UInput
            class="w-full p-3 text-black bg-white border border-gray-100 rounded-md"
            v-model="stateCheckout.fullName"
            type="text"
            placeholder="Enter your full name"
          />
        </UFormGroup>

        <!-- Address -->
        <UFormGroup label="Address" name="address" class="mb-4">
          <textarea
            class="w-full p-3 text-black bg-white border border-gray-100 rounded-md resize-none"
            v-model="stateCheckout.address"
            placeholder="Enter your delivery address"
            rows="3"
          ></textarea>
        </UFormGroup>

        <!-- Telephone -->
        <UFormGroup label="Telephone" name="telephone" class="mb-4">
          <UInput
            class="w-full p-3 text-black bg-white border border-gray-100 rounded-md"
            v-model="stateCheckout.telephone"
            type="tel"
            placeholder="Enter your phone number"
          />
        </UFormGroup>

        <!-- Comment -->
        <UFormGroup label="Comment (Optional)" name="comment" class="mb-4">
          <textarea
            class="w-full p-3 text-black bg-white border border-gray-100 rounded-md resize-none"
            v-model="stateCheckout.comment"
            placeholder="Add any comments or special instructions"
            rows="2"
          ></textarea>
        </UFormGroup>

        <!-- Payment Method -->
        <div class="mb-6">
          <h3 class="font-semibold text-gray-800 mb-2">Payment Method</h3>
          <div class="flex items-center space-x-4">
            <label class="flex items-center space-x-2">
              <input
                type="radio"
                value="online"
                v-model="stateCheckout.paymentMethod"
                class="form-radio text-blue-500"
              />
              <span>Pay Online</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                type="radio"
                value="cash"
                v-model="stateCheckout.paymentMethod"
                class="form-radio text-blue-500"
              />
              <span>Cash on Delivery</span>
            </label>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="text-center mt-6">
          <UButton
            type="submit"
            class="w-full py-4 bg-gradient-to-r from-blue-500 to-green-400 text-white rounded-lg font-semibold text-xl hover:bg-green-500 transition-colors"
          >
            Place Order
          </UButton>
        </div>
      </UForm>
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
import { type Product, type Category, type ProductDetail, type CartItem } from '~/types/types';
import { getStarStyle } from '~/scripts/getStarStyle'
import { formatDistanceToNow } from 'date-fns'

const router = useRouter();
const cartItems = ref<CartItem[] | null>(null);

// Schema for validation
const schemaCheckout = object({
  fullName: string().required('Full Name is required'),
  address: string().required('Address is required'),
  telephone: string()
    .matches(/^\+?[0-9]{7,15}$/, 'Enter a valid phone number')
    .required('Telephone is required'),
  comment: string().optional(),
  paymentMethod: string().required('Select a payment method'),
});

// State for form data
const stateCheckout = ref({
  fullName: '',
  address: '',
  telephone: '',
  comment: '',
  paymentMethod: 'online', // Default payment method
});
const handleCheckout = async () => {
  try {
    // Retrieve products from local storage
    const cartProducts = JSON.parse(localStorage.getItem('cart') || '[]');
    if (!Array.isArray(cartProducts) || cartProducts.length === 0) {
      notifyUser('Your cart is empty!', 'danger');
      return;
    }

    // Prepare checkout data, including products from local storage
    const checkoutData = {
      ...stateCheckout.value,
      products: cartProducts,
    };

    // Log current checkout state for debugging
    console.log('Placing order:', checkoutData);

    // Make the API call to the checkout endpoint
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwtToken') || ''}`, // Authorization header
      },
      body: JSON.stringify(checkoutData),
    });

    // Parse the JSON response
    const data = await response.json();

    if (response.ok && data.success) {
      // Clear cart after successful checkout
      localStorage.removeItem('cart');

      // Show success notification
      notifyUser('Order placed successfully!', 'success');

      // Redirect to the index page
      router.push('/');
    } else {
      // Show error notification
      notifyUser(data.message || 'Failed to place order', 'danger');
    }
  } catch (error) {
    console.error('Error during checkout:', error);
    // Show error notification
    notifyUser('An unexpected error occurred while placing the order', 'danger');
  }
};


const fetchCartItems = () => {
    const rawCartData = localStorage.getItem('cart');
    if (rawCartData) {
        const parsedCart = JSON.parse(rawCartData);

        const transformedCart: CartItem[] = parsedCart.map((item: any) => ({
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
        }));

        cartItems.value = transformedCart;
    } else {
        cartItems.value = [];
    }
};

onMounted(() => {
    fetchCartItems();
});


onMounted(async () => {
    var isAuthValue = localStorage.getItem('isAuth');
    var authJwtTokenValue = localStorage.getItem('jwtToken');
    authUserIdChange(isAuthValue ?? '');
    changeIsAuth(isAuthValue !== null && !isNaN(Number(isAuthValue)));
    authJwtTokenChange(authJwtTokenValue ?? '');
    if (authJwtToken.value !== null && authJwtToken.value !== '') {
        SendLastActivity();
        fetchCartItems()
    }
});
</script>

<style scoped>
.mt-6 {
  margin-top: 6rem;
}
textarea {
  outline: none;
}
</style>