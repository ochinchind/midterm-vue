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

  <div class="p-8 bg-gray-100 min-h-screen flex justify-center items-start mt-6">
    <div v-if="isLoading" class="text-center">
      <p class="text-2xl font-semibold text-gray-600">Loading...</p>
    </div>
    <div v-else-if="product" class="bg-white p-10 rounded-lg shadow-2xl max-w-5xl w-full flex">
  
      <!-- Gallery Thumbnails -->
      <div class="w-1/6 pr-4 flex flex-col space-y-4">
        <div v-for="(image, index) in product.photos" :key="index" class="cursor-pointer">
          <img
            :src="image"
            :alt="'Image ' + (index + 1)"
            class="w-20 h-20 object-cover rounded-lg shadow-md"
            @click="updateMainImage(image)"
          />
        </div>
      </div>
  
      <!-- Main Image and Product Information -->
      <div class="w-5/6">
        <!-- Main Image -->
        <div class="mb-6">
          <img :src="currentImage" alt="Main product image" class="w-full h-96 object-cover rounded-lg shadow-lg" />
        </div>
  
        <div class="flex items-center justify-between w-full mb-6">
          <!-- Product Info (Name and Price in Column) -->
          <div class="flex flex-col">
            <!-- Product Name -->
            <h1 class="text-4xl font-extrabold text-gray-800">{{ product.name }}</h1>
            <!-- Price -->
            <p class="text-3xl font-bold text-green-600">$ {{ product.price }}</p>
          </div>

          <button @click="toggleFavorite(product)" 
        class="favorite-button"
        :class="product.isInFavorites ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 hover:bg-gray-400'">
  <img :src="product.isInFavorites ? '/fav.png' : '/not_fav.png'" 
       alt="Favorite" 
       class="w-full h-full object-contain" />
</button>
        </div>
        
        <div class="bg-gray-50 p-6 rounded-lg shadow-lg mb-8">
          <h2 class="text-2xl font-semibold mb-4">Product Description</h2>
          <p class="text-gray-700 leading-relaxed">{{ product.description }}</p>
        </div>
  
        <div class="bg-gray-50 p-6 rounded-lg shadow-lg mb-8">
          <div class="mb-4">
            <label class="block text-lg font-semibold text-gray-700 mb-2">Choose Size</label>
            <select class="w-full p-2 border rounded-md">
              <option v-for="size in product.sizes" :key="size" :value="size">{{ size }}</option>
            </select>
          </div>
          <div>
            <label class="block text-lg font-semibold text-gray-700 mb-2">Choose Color</label>
            <select class="w-full p-2 border rounded-md">
              <option v-for="color in product.colors" :key="color" :value="color">{{ color }}</option>
            </select>
          </div>
        </div>
  
        <div class="bg-gray-50 p-6 rounded-lg shadow-lg mb-8">
          <h2 class="text-2xl font-semibold mb-4">Customer Reviews</h2>
          <div class="flex items-center mb-4">
            <span class="stars" :style="getStarStyle(product.rating)">★★★★★</span>
            <span class="ml-3 text-lg text-gray-500">{{ product.rating }} stars</span>
          </div>
          <div v-if="product.reviews.length" class="space-y-4">
            <div v-for="(review, index) in product.reviews" :key="index" class="p-4 bg-gray-100 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <p class="font-semibold">{{ review.username }}</p>
              </div>
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center">
                  <span class="stars" :style="getStarStyle(review.rating)">★★★★★</span>
                </div>
                <span class="text-sm text-gray-400">{{ formatLastActivity(review.created_at) }}</span>
              </div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-400">Last activity: {{ formatLastActivity(review.last_activity) }}</span>
              </div>
              <p class="italic text-gray-600">"{{ review.text }}"</p>
            </div>
          </div>
          <p v-else class="italic text-gray-500">No reviews yet.</p>
        </div>

        <div v-if="isAuth" class="bg-gray-50 p-6 rounded-lg shadow-lg mb-8">
        <h2 class="text-2xl font-semibold mb-4">Add a Review</h2>
        <UForm @submit="submitReview" :schema="reviewSchema" :state="formStateReview">
          
          <!-- Rating Selection -->
          <UFormGroup label="Rating" name="rating" class="mb-4">
            <USelect v-model="formStateReview.rating" placeholder="Select rating" :options="ratings" class="w-full p-2 border rounded-md">
              
            </USelect>
          </UFormGroup>

          <!-- Review Textarea -->
          <UFormGroup label="Review" name="text" class="mb-4">
            <UTextarea 
              v-model="formStateReview.text" 
              placeholder="Enter your review" 
              class="w-full p-2 text-black bg-white border border-gray-100 rounded-md" 
            />
          </UFormGroup>

          <!-- Submit Button -->
          <UButton type="submit" class="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold text-lg hover:bg-blue-600 transition-colors">
            Submit Review
          </UButton>

        </UForm>
      </div>
  
        <button @click="addToCart(product)"
        :class="[
            'w-full py-4 text-white rounded-lg font-semibold text-2xl transition-colors',
            product.isInCart 
              ? 'bg-red-500 hover:bg-red-600 !important' 
              : 'bg-blue-500 hover:bg-green-500 !important'
          ]">
          {{ product.isInCart ? 'Remove from Cart' : 'Add to Cart' }}
        </button>
      </div>
    </div>
    <div v-else>
      <p class="text-2xl font-bold text-red-500">Product not found.</p>
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

const formatLastActivity = (lastActivity: string) => {
  return formatDistanceToNow(new Date(lastActivity), { addSuffix: true })
}

// Retrieve product ID from route
const route = useRoute()
const productId = route.params.id
const isLoading = ref(true) 

// Product state with photos and reviews
const product = ref<ProductDetail | null>(null) 
const currentImage = ref('')
const ratings = [
  { label: '1 Star', value: 1 },
  { label: '2 Stars', value: 2 },
  { label: '3 Stars', value: 3 },
  { label: '4 Stars', value: 4 },
  { label: '5 Stars', value: 5 }
]


const reviewSchema = object({
  rating: string().required('Rating is required'),
  text: string().required('Review text is required').min(10, 'Review should be at least 10 characters long')
})

type SchemaReviewType = InferType<typeof reviewSchema>;

const formStateReview = reactive<SchemaReviewType>({
  rating: '',
  text: ''
});


const submitReview = async () => {
  try {
    const response = await fetch(`/api/createreview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authJwtToken.value },
      body: JSON.stringify({
        product_id: productId,
        rating: formStateReview.rating,
        text: formStateReview.text,
      })
    })

    const result = await response.json()
    if (result.success) {
      notifyUser('Review added successfully!', 'success')
      fetchProduct();
      formStateReview.rating = '';
      formStateReview.text = '';
    } else {
      notifyUser('Failed to add review: ' + result.message, 'danger')
    }
  } catch (err) {
    alert(err);
    console.error('Error creating review:', err)
  }
}

const updateMainImage = (image: any) => {
  currentImage.value = image
}

const fetchProduct = async () => {
  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authJwtToken.value }
    })
    const data = await response.json()
    if (data.success) {
      product.value = data.product
      currentImage.value = data.product.photos[0] // Set initial main image
      // check if localtosrage has in cart 
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (product.value) {
        if (product.value && cart.find((item: { id: number }) => item.id === product.value.id)) {
          product.value.isInCart = true;
        }
      }
      let favs = JSON.parse(localStorage.getItem('favs') || '[]');
      if (product.value) {
        if (product.value && favs.find((item: { id: number }) => item.id === product.value.id)) {
          product.value.isInFavorites = true;
        }
      }
    } else {
      console.error('Product not found')
    }
  } catch (error) {
    console.error('Error fetching product:', error)
  } finally {
    isLoading.value = false // Update loading state after request completes
  }
}

const addToCart = async (product: ProductDetail) => {
  try {
    // Get the current cart from localStorage or initialize it
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Ensure cart is an array
    if (!Array.isArray(cart)) {
      cart = []; // Initialize as an empty array if invalid
    }

    // Check if the product is already in the cart when the whole product object is stored in the cart
    const existingProductIndex = cart.findIndex((item: { id: number }) => item.id === product.id);
    

    if (existingProductIndex > -1) {
      // Product exists, remove it
      cart.splice(existingProductIndex, 1);
      product.isInCart = false;
      notifyUser('Product removed from cart', 'info');
    } else {
      // Add product to cart
      cart.push(product);
      product.isInCart = true;
      notifyUser('Product added to cart', 'success');
    }

    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

  } catch (err) {
    console.error('Error managing cart locally:', err);
    notifyUser('Something went wrong!', 'danger');
  }
};

const toggleFavorite = async (product: ProductDetail) => {
  try {
    // Get the current cart from localStorage or initialize it
    let favs = JSON.parse(localStorage.getItem('favs') || '[]');

    // Ensure cart is an array
    if (!Array.isArray(favs)) {
      favs = []; // Initialize as an empty array if invalid
    }

    // Check if the product is already in the cart when the whole product object is stored in the cart
    const existingProductIndex = favs.findIndex((item: { id: number }) => item.id === product.id);
    

    if (existingProductIndex > -1) {
      // Product exists, remove it
      favs.splice(existingProductIndex, 1);
      product.isInFavorites = false;
      notifyUser('Product removed from favs', 'info');
    } else {
      // Add product to cart
      favs.push(product);
      product.isInFavorites = true;
      notifyUser('Product added to favs', 'success');
    }

    // Update localStorage
    localStorage.setItem('favs', JSON.stringify(favs));

  } catch (err) {
    console.error('Error managing cart locally:', err);
    notifyUser('Something went wrong!', 'danger');
  }
};



onMounted(async () => {
    var isAuthValue = localStorage.getItem('isAuth');
    var authJwtTokenValue = localStorage.getItem('jwtToken');
    authUserIdChange(isAuthValue ?? '');
    changeIsAuth(isAuthValue !== null && !isNaN(Number(isAuthValue)));
    authJwtTokenChange(authJwtTokenValue ?? '');
    if (authJwtToken.value !== null && authJwtToken.value !== '') {
        SendLastActivity();
    }
    fetchProduct()
});

</script>
  
<style scoped>
.container {
  max-width: 1200px;
}

h1 {
  letter-spacing: 1px;
}

img {
  border-radius: 12px;
}
.mt-6 {
  margin-top: 6rem;
}

button {
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(90deg, rgba(72,149,239,1) 0%, rgba(0,212,255,1) 100%);
}

.favorite-button {
  background: transparent !important; /* Remove any inherited background */
  border: none; /* Remove any borders */
  box-shadow: none; /* Remove any box shadow if any */
  width: 50px; /* Set width to 30px */
  height: 50px; /* Set height to 30px */
  padding: 0; /* Remove padding to make it exactly 30px by 30px */
  display: flex; /* Flexbox to align the image */
  justify-content: center; /* Center image horizontally */
  align-items: center; /* Center image vertically */
}

.favorite-button:focus,
.favorite-button:hover {
  background: transparent !important; /* Ensure transparency on hover and focus */
}

.favorite-button img {
  width: 50px; /* Set image width */
  height: 50px; /* Set image height */
  object-fit: contain; /* Ensure the image is contained within the button */
}

button:hover {
  background: linear-gradient(90deg, rgba(72,239,169,1) 0%, rgba(0,255,212,1) 100%);
}
</style>
