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

    <div class="my-orders mt-6">
      <h1>My Orders</h1>
      <div v-if="loading" class="loading">Loading orders...</div>
      <div v-else-if="orders.length === 0" class="no-orders">No orders found!</div>
      <div v-else>
        <div v-for="order in orders" :key="order.id" class="order relative border p-4 mb-6 rounded-lg shadow-lg">
          <!-- Cancel Button at the top-right -->
          <div v-if="order.status !== 'canceled'" class="absolute top-2 right-2">
            <UButton 
              @click="cancelOrder(order.id)"
              class="text-white bg-red-500 hover:bg-red-600 py-1 px-3 rounded-full text-sm"
            >
              Cancel Order
            </UButton>
          </div>

          <!-- Order Summary Section -->
          <div class="order-summary cursor-pointer" @click="toggleOrder(order.id)">
            <h2 class="text-xl font-semibold text-dark">Order #{{ order.id }}</h2>
            <p>Status: <span :class="{'text-red-500': order.status === 'canceled', 'text-green-500': order.status !== 'canceled'}">{{ order.status }}</span></p>
            <p class="text-sm text-gray-600">Address: {{ order.address }}</p>
            <p class="text-sm text-gray-600">Full Name: {{ order.full_name }}</p>
            <p class="text-sm text-gray-600">Telephone: {{ order.telephone }}</p>
          </div>
          <div v-if="expandedOrder === order.id" class="order-details mt-4">
            <h3 class="text-lg font-semibold mb-2">Products:</h3>
            <ul class="space-y-4">
              <li v-for="product in order.products" :key="product.id" class="product flex items-center gap-4 border-t pt-4">
                <img :src="product.photos[0]" alt="Product photo" class="w-24 h-24 object-cover rounded-md" />
                <div class="flex-1">
                  <h4 class="font-semibold text-lg">{{ product.name }}</h4>
                  <p class="text-gray-600">{{ product.description }}</p>
                  <p class="font-medium text-orange-500">Price: ${{ product.price }}</p>
                  <p class="text-sm text-gray-500">Category: {{ product.category_name }}</p>
                  <p class="text-sm text-yellow-500">Rating: {{ product.rating }}★</p>
                </div>
                <div class="reviews flex-1">
                  <h5 class="text-sm font-semibold mb-2">Reviews:</h5>
                  <ul class="space-y-2">
                    <li v-for="review in product.reviews" :key="review.user_id + review.text">
                      <p><strong class="text-gray-700">{{ review.username }}:</strong> {{ review.text }}</p>
                      <p class="text-sm text-gray-500">Rating: {{ review.rating }}★</p>
                      <p class="text-xs text-gray-400">Reviewed on: {{ new Date(review.created_at).toLocaleString() }}</p>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
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
    import { type Product, type Category, type ProductDetail, type CartItem, type Review } from '~/types/types';
    import { getStarStyle } from '~/scripts/getStarStyle'
    import { formatDistanceToNow } from 'date-fns'

    const router = useRouter();
    interface Order {
        id: number;
        status: string;
        address: string;
        full_name: string;
        telephone: string;
        products: Product[];
        photos: string[];
        category_name: string;
        rating: number;
        reviews: Review[];
    }

    const orders = ref<Order[]>([]);
    const loading = ref(true);
    const expandedOrder = ref<number | null>(null);

    const cancelOrder = async (orderId: number) => {
      try {
        const response = await fetch('/api/cancelorder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('jwtToken') || ''}`,
          },
          body: JSON.stringify({ orderId: orderId }),
        });
        const data = await response.json();

        if (response.ok && data.success) {
          // Update the order status to 'canceled' locally
          const order = orders.value.find(order => order.id === orderId);
          if (order) {
            order.status = 'canceled';
          }
        } else {
          console.error('Failed to cancel order:', data.message);
        }
      } catch (error) {
        console.error('Error cancelling order:', error);
      }
    };
    
    const fetchOrders = async () => {
    try {
        const response = await fetch('/api/my-orders', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken') || ''}`,
        },
        });
        const data = await response.json();
        console.log(data);  
        if (response.ok && data.success) {
        orders.value = data.orders;
        } else {
        console.error('Failed to fetch orders:', data.message);
        router.push('/');
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
    } finally {
        loading.value = false;
    }
    };

    const toggleOrder = (orderId: number) => {
    expandedOrder.value = expandedOrder.value === orderId ? null : orderId;
    };

    onMounted(fetchOrders);



    onMounted(async () => {
        var isAuthValue = localStorage.getItem('isAuth');
        var authJwtTokenValue = localStorage.getItem('jwtToken');
        authUserIdChange(isAuthValue ?? '');
        changeIsAuth(isAuthValue !== null && !isNaN(Number(isAuthValue)));
        authJwtTokenChange(authJwtTokenValue ?? '');
        if (authJwtToken.value !== null && authJwtToken.value !== '') {
            SendLastActivity();
            fetchOrders()
        }
    });

    definePageMeta({
      middleware: [
        'auth',
      ],
    });
</script>
  
  <style scoped>
  .mt-6 {
    margin-top: 6rem;
  }
  .my-orders {
    padding: 20px;
  }

  .order {
    border: 1px solid #ddd;
    padding: 20px;
    margin-bottom: 15px;
    border-radius: 8px;
    transition: box-shadow 0.3s ease;
  }

  .order:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .order-summary {
    cursor: pointer;
  }

  .order-details {
    margin-top: 15px;
  }

  .product {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
  }

  .reviews {
    margin-top: 15px;
  }

  .modal-body {
    padding: 20px;
  }

  .loading {
    font-size: 1.2rem;
    color: gray;
  }

  .no-orders {
    font-size: 1.2rem;
    color: gray;
  }
  </style>
  