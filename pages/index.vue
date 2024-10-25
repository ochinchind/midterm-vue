<script setup lang="ts">

import { useRouter } from 'vue-router'
import { object, string, type InferType } from 'yup'
import type { FormError, FormErrorEvent, FormSubmitEvent } from '#ui/types'
import { isAuth, authUserId, authJwtToken, trueIsAuth, toggleIsAuth, changeIsAuth, falseIsAuth, authUserIdChange, authJwtTokenChange, logout, showForgetPasswordModal, toggleForgetPasswordModal, closeForgetPasswordModal, isLoadingForgetPassword, sendForgetPasswordToEmail, isLoadingForgetChangePassword, changePasswordForget, SendLastActivity, LoginSubmit, schemaLogin, stateLogin, RegisterSubmit, schemaRegister, stateRegister, showLoginModal, toggleLoginModal, closeLoginModal, showRegisterModal, toggleRegisterModal, closeRegisterModal } from '~/scripts/auth'
import { notifyUser, notificationMessage } from '~/scripts/notifications'
import { type Product } from '~/types/types';
import { getStarStyle } from '~/scripts/getStarStyle'

const router = useRouter()

const categories = [
  { name: 'Men', slug: 'men' },
  { name: 'Women', slug: 'women' },
  { name: 'Kids', slug: 'kids' },
  { name: 'Accessories', slug: 'accessories' }
]

function goToCategory(slug: string) {
  router.push(`/products?slug=${slug}`)
}

function goToProductsPage() {
  router.push('/products') 
}

const schemaSubmitEmail = object({
  email: string().required('Email is required!').email(),
});

type SchemaSubmitEmailType = InferType<typeof schemaSubmitEmail>;

const formStateSubmitEmail = reactive<SchemaSubmitEmailType>({
  email: '',
});

const isSendingEmail = ref(false);

const submitEmailNews = async (event: any) => {
  event.preventDefault();
  isSendingEmail.value = true;
  try {
    const response = await fetch('/api/subscribenews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: formStateSubmitEmail.email }),
    });

    const result = await response.json();
    if (result.success) {
      notifyUser('Subscribed to news!', 'success');
    } else {
      notifyUser('Error when subscribing!', 'danger');
    }
  } catch (error) {
    notifyUser('Error submitting code', 'danger');
  } finally {
    isSendingEmail.value = false;
  }
};


const randomProducts = ref<Product[]>([]);

onMounted(async () => {
  try {
    const response = await fetch('/api/getrandomproducts');
    if (response.ok) {
      const products = await response.json();
      randomProducts.value = products.products;
    } else {
      console.error('Failed to fetch random products');
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
});

</script>

<script lang="ts">

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
    };
  },
  computed: {
    
  },
  mounted() {
    var isAuthValue = localStorage.getItem('isAuth');
    var authJwtTokenValue = localStorage.getItem('jwtToken');
    authUserIdChange(isAuthValue ?? '');
    changeIsAuth(isAuthValue !== null && !isNaN(Number(isAuthValue)));
    authJwtTokenChange(authJwtTokenValue ?? '');
    if (authJwtToken.value !== null && authJwtToken.value !== '') {
        SendLastActivity();
    }
  },
  beforeUnmount() {

  },
  methods: {
    
  }
}
</script>

<style>
.stars {
    font-size: 1.5em;
    letter-spacing: 6px;
    background: -webkit-gradient(linear, left top, right top, color-stop(0, #ffb904), color-stop(55%, #ffb904), color-stop(0, #e4e4e4), to(#e4e4e4));
    background: linear-gradient(90deg, #ffb904 0, #ffb904 55%, #e4e4e4 0, #e4e4e4 100%);
    -webkit-background-clip: text;
    color: transparent;
    line-height: 1;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
</style>

<style scoped>
.w-100 {
    width: 100%;
}

.btn-orange {
    background-color: rgb(253, 186, 116);
    transition: background-color 0.3s ease, transform 0.3s ease;
    padding: 12px 24px;
    border-radius: 8px;
    color: white;
    font-size: 1.25rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-orange:hover {
    background-color: rgb(251, 146, 60);
    transform: scale(1.05);
}

.section {
    padding: 3rem 1.5rem;
    background-color: #f7f7f7;
}

.text-balance {
    line-height: 1.3;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
}

h1, h2 {
    color: #111827;
}

p {
    color: #374151;
}

/* Testimonials Styling */
.testimonial-section {
    background-color: #111827;
    color: white;
    padding: 4rem 2rem;
    text-align: center;
}

.testimonial-item {
    margin-bottom: 2rem;
    font-style: italic;
}

.featured-section {
    padding: 3rem 1.5rem;
    background-color: #f0f9ff;
    text-align: center;
}

.featured-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.featured-item img {
    border-radius: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.featured-item h3 {
    margin-bottom: 0.5rem;
}

.w-100 {
    width: 100%;
}

.btn-orange:hover {
    background-color: rgb(251 146 60);
}

.footer {
    background-color: #1a1a1a;
    color: white;
    padding: 20px 0;
}

.footer-links {
    display: flex;
    justify-content: center;
    gap: 2rem;
}

.footer-links a {
    color: white;
    text-decoration: none;
}

.footer-links a:hover {
    color: #f97316;
}

.footer-social {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
}

.footer-social img {
    width: 24px;
    height: 24px;
    cursor: pointer;
}

.footer-social img:hover {
    opacity: 0.7;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Hero Section */
.hero {
  background: url('#') no-repeat center center / cover;
  color: white;
  padding: 60px 0;
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero-description {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

/* Section Styles */
.section {
  padding: 2rem 0;
  margin-top: 1.5em;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

/* New Arrivals Section */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin: 0 1.5rem;
}

.product-item {
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  background-color: white;
}

.product-image {
  width: 100%;
  border-radius: 8px;
}

/* Categories Section */
.category-grid {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 0 1.5rem;
}

.category-item {
  padding: 15px 30px;
  background-color: #f0f9ff;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
}

/* Promotions Section */
.promotion-message {
  text-align: center;
  font-size: 1.25rem;
}

/* Testimonials Section */
.testimonial-item {
  text-align: center;
  margin: 1rem 0;
}

/* Newsletter Signup */
.newsletter-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 300px;
  margin-right: 10px;
}

/* Footer Section */
.footer {
  background-color: #1a1a1a;
  color: white;
  padding: 20px 0;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.footer-links a {
  color: white;
  text-decoration: none;
}

.footer-links a:hover {
  color: #f97316; /* orange color on hover */
}

.footer-social {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.footer-social img {
  width: 24px;
  height: 24px;
}

.footer-text {
  margin-top: 10px;
}

@media (min-width: 1024px) {
    h1 {
        font-size: 3.5rem;
    }
    
    p {
        font-size: 1.5rem;
    }
}

.mt-20 {
margin-top: 5rem;
}
</style>

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
  <main>
    <!-- Hero Section -->
    <section class="section mt-20">
      <div class="container flex flex-col lg:flex-row items-center gap-10">
        <div class="flex-1 order-2 lg:order-1 text-center lg:text-left">
          <h1 class="text-4xl lg:text-6xl font-extrabold mb-6 text-balance">
            Luxury Sneakers - Unleash Your Potential!
          </h1>
          <p class="text-xl lg:text-2xl mb-8 text-balance">
            Discover sneakers that will elevate your style and performance.
          </p>
          <button
            class="px-4 py-2 self-start bg-orange-200 rounded-md text-lg cursor-pointer btn-orange"
            @click="goToProductsPage"
          >
            Browse Sneakers
          </button>
        </div>
        <div class="flex-1 order-1 lg:order-2">
          <NuxtImg class="w-100" src="/sneakers.webp" alt="Sneakers shop" />
        </div>
      </div>
    </section>

    <section class="new-arrivals section py-10 bg-gray-100">
  <h2 class="section-title text-3xl font-semibold text-center text-orange-600 mb-8">New Arrivals</h2>

  <div v-if="randomProducts.length === 0" class="product-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6 md:px-16">
    <!-- Shimmer Placeholder -->
    <div v-for="n in 4" :key="n" class="product-item bg-white rounded-lg shadow-md p-4 animate-pulse">
      <div class="product-image bg-gray-300 h-48 rounded-t-lg w-full"></div>
      <div class="product-info mt-4">
        <div class="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div class="h-5 bg-gray-300 rounded w-1/4 mb-2"></div>
        <div class="h-5 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  </div>

  <!-- Products Grid -->
  <div v-else class="product-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6 md:px-16">
    <NuxtLink 
      v-for="product in randomProducts" 
      :key="product.id" 
      :to="`/product/${product.id}`" 
      class="product-item bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 block"
    >
      <NuxtImg 
        :src="product.image_url || '/sneakers.jpg'" 
        :alt="product.name || 'Default Sneaker'" 
        class="product-image w-full h-48 object-cover rounded-t-lg"
      />
      <div class="product-info mt-4">
        <h3 class="product-name text-lg font-semibold text-gray-800">{{ product.name }}</h3>
        <p class="product-price text-orange-500 font-bold mt-2">${{ product.price }}</p>
        <p class="product-rating text-gray-600 mt-2">
          Rating: <span class="stars" :style="getStarStyle(product.rating)">★★★★★</span>
        </p>
      </div>
    </NuxtLink>
  </div>
</section>

     <!-- Categories Section -->
  <section class="categories section">
    <h2 class="section-title">Shop By Category</h2>
    <div class="category-grid">
      <!-- Render categories dynamically -->
      <div
        v-for="category in categories"
        :key="category.slug"
        class="category-item"
        @click="goToCategory(category.slug)"
      >
        {{ category.name }}
      </div>
    </div>
  </section>

    <!-- Promotions Section -->
    <section class="promotions section">
      <h2 class="section-title">Special Offers</h2>
      <p class="promotion-message">Get up to 50% off on selected items!</p>
    </section>

    <!-- Newsletter Signup -->
    <section class="newsletter section text-center">
      <h2 class="section-title">Subscribe to Our Newsletter</h2>
      <p>Get the latest updates and exclusive offers.</p>
      <UForm @submit="submitEmailNews"  :schema="schemaSubmitEmail" :state="formStateSubmitEmail" class="flex text-center justify-center items-center align-center">
        <UFormGroup name="email">
              <UInput
                v-model="formStateSubmitEmail.email"
                type="text"
                placeholder="Enter the code here"
                class="newsletter-input"
              />
        </UFormGroup>
      <UButton
              :disabled="isSendingEmail"
                type="submit"
                class=" py-2 text-white font-semibold bg-orange-500 rounded-md shadow hover:bg-orange-600 transition duration-300 flex items-center justify-center"
              >
              <div v-if="isSendingEmail" class="w-5 h-5 mr-2 border-4 border-t-orange-500 border-orange-200 rounded-full animate-spin"></div>
              <span v-if="!isSendingEmail">Subscribe</span>
              <span v-else>Loading...</span>
      </UButton>
     </UForm>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonial-section section">
      <h2 class="section-title">What Our Customers Say</h2>
      <div class="testimonial-item">
        <p>"These sneakers are not just shoes, they're a lifestyle upgrade!"</p>
        <span>- John Doe</span>
      </div>
      <div class="testimonial-item">
        <p>"Comfortable, stylish, and perfect for everyday wear!"</p>
        <span>- Sarah Lee</span>
      </div>
      <div class="testimonial-item">
        <p>"I'm so impressed with the quality and the design!"</p>
        <span>- Alex Smith</span>
      </div>
    </section>

  </main>

  <!-- Footer Section -->
  <footer class="footer">
    <div class="container mx-auto text-center">
      <div class="footer-links">
        <a href="/">Home</a>
        <a href="/about">About Us</a>
        <a href="/contact">Contact</a>
      </div>
      <div class="footer-social">
        <a href="#"><img src="/facebook.png" alt="Facebook"></a>
        <a href="#"><img src="/twitter.png" alt="Twitter"></a>
        <a href="#"><img src="/instagram.png" alt="Instagram"></a>
      </div>
      <p class="mt-4">&copy; 2024 Sneaker Shop. All rights reserved.</p>
    </div>
  </footer>
</template>
