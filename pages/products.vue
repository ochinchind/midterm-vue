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
    <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">Available Sneakers</h1>

    <!-- Фильтры -->
    <div class="flex justify-between mb-6">
      <!-- Фильтр по цене -->
      <div>
        <label for="category-filter" class="text-lg font-semibold text-gray-700">Filter by Category:</label>
        <select id="category-filter" v-model="selectedCategory" class="ml-2 p-2 border rounded-md">
          <option value="all">All</option>
          <option v-for="category in categories" :key="category.id" :value="category.slug">{{ category.name }}</option>
        </select>
      </div>

      <div>
        <label for="price-filter" class="text-lg font-semibold text-gray-700">Filter by Price:</label>
        <select id="price-filter" v-model="selectedPrice" class="ml-2 p-2 border rounded-md">
          <option value="all">All</option>
          <option value="50-100">$50 - $100</option>
          <option value="100-150">$100 - $150</option>
          <option value="150-200">$150 - $200</option>
        </select>
      </div>

      <!-- Фильтр по рейтингу -->
      <div>
        <label for="rating-filter" class="text-lg font-semibold text-gray-700">Filter by Rating:</label>
        <select id="rating-filter" v-model="selectedRating" class="ml-2 p-2 border rounded-md">
          <option value="all">All</option>
          <option value="4">4 stars & up</option>
          <option value="3">3 stars & up</option>
          <option value="2">2 stars & up</option>
          <option value="1">1 star & up</option>
        </select>
      </div>
    </div>

    <!-- Список товаров -->
    <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <!-- Shimmer Effect for Loading State -->
      <div v-for="index in 5" :key="index" class="border p-4 bg-white shadow-lg rounded-lg animate-pulse">
        <div class="w-full h-40 bg-gray-300 rounded-t-lg mb-4"></div>
        <div class="h-6 bg-gray-300 rounded mb-2"></div>
        <div class="h-4 bg-gray-300 rounded mb-2"></div>
        <div class="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>

    <!-- No Products Found Message -->
    <div v-else-if="products.length === 0" class="flex justify-center items-center text-lg font-semibold text-gray-600 h-40">
      No products were found.
    </div>

    <!-- Products Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <div
        v-for="(product, index) in products"
        :key="index"
        class="border p-4 bg-white shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl cursor-pointer"
        @click="goToProductPage(product.id)"
      >
        <img :src="product.image_url" alt="Sneaker image" class="w-full h-40 object-cover rounded-t-lg mb-4" />
        <h2 class="text-lg font-semibold mb-2 text-gray-700">{{ product.name }}</h2>
        <p class="text-gray-500 mb-2">${{ product.price }}</p>
        <div class="flex items-center mb-4">
          <span class="stars" :style="getStarStyle(product.rating)">★★★★★</span>
        </div>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div v-if="products.length > 0" class="flex justify-center items-center space-x-4 mt-10">
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-orange-500 text-white rounded disabled:bg-gray-400"
      >
        Previous
      </button>
      <span class="text-lg font-semibold text-gray-700">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-orange-500 text-white rounded disabled:bg-gray-400"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { FormError, FormErrorEvent, FormSubmitEvent } from '#ui/types'
import { isAuth, authUserId, authJwtToken, trueIsAuth, toggleIsAuth, changeIsAuth, falseIsAuth, authUserIdChange, authJwtTokenChange, logout, showForgetPasswordModal, toggleForgetPasswordModal, closeForgetPasswordModal, isLoadingForgetPassword, sendForgetPasswordToEmail, isLoadingForgetChangePassword, changePasswordForget, SendLastActivity, LoginSubmit, schemaLogin, stateLogin, RegisterSubmit, schemaRegister, stateRegister, showLoginModal, toggleLoginModal, closeLoginModal, showRegisterModal, toggleRegisterModal, closeRegisterModal } from '~/scripts/auth'
import { notifyUser, notificationMessage } from '~/scripts/notifications'
import { type Product, type Category } from '~/types/types';
import { getStarStyle } from '~/scripts/getStarStyle'

const selectedPrice = ref('all')
const selectedRating = ref('all')
const selectedCategory = ref('all')
const router = useRouter()
const route = useRoute()
const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const currentPage = ref(1)
const totalPages = ref(0)
const isLoading = ref(true)

const fetchCategories = async () => {
  try {
    const response = await fetch('/api/getcategories')
    const result = await response.json()
    if (result.success) {
      categories.value = result.categories;
      const slug = route.query.slug as string;
      if (slug) {
        const matchedCategory = categories.value.find(category => category.slug === slug);
        console.log(categories.value)
        if (matchedCategory) selectedCategory.value = matchedCategory.slug;
      }
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}


const fetchProducts = async () => {
  isLoading.value = true;
  products.value = [];
  try {
    const response = await fetch('/api/getproducts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price: selectedPrice.value,
        rating: selectedRating.value,
        category: selectedCategory.value !== 'all' ? selectedCategory.value : null,
        page: currentPage.value
      })
    })
    const result = await response.json()
    if (result.success) {
      products.value = result.products
      totalPages.value = Math.ceil(result.totalProducts / 5)
    }
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    isLoading.value = false;
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
}

const goToProductPage = (id) => {
  router.push(`/product/${id}`)
}

onMounted(async () => {
    var isAuthValue = localStorage.getItem('isAuth');
    var authJwtTokenValue = localStorage.getItem('jwtToken');
    authUserIdChange(isAuthValue ?? '');
    changeIsAuth(isAuthValue !== null && !isNaN(Number(isAuthValue)));
    authJwtTokenChange(authJwtTokenValue ?? '');
    if (authJwtToken.value !== null && authJwtToken.value !== '') {
        SendLastActivity();
    }
});

onMounted(() => {
  fetchCategories()
  

  fetchProducts();
})


watch(selectedPrice, fetchProducts)
watch(selectedRating, fetchProducts)
watch(currentPage, fetchProducts)
watch(selectedCategory, fetchProducts)
</script>

<style scoped>
.container {
  margin-top: 120px;
}
.mt-6 {
  margin-top:6rem;
}
</style>

<style scoped>
.container {
  margin-top: 120px; /* Настраиваем отступ сверху */
}
.mt-6 {
  margin-top:6rem;
}
</style>
