<script setup lang="ts">
<<<<<<< HEAD
// Script remains available for future logic
=======

import { useRouter } from 'vue-router'
import { object, string, type InferType } from 'yup'
import type { FormError, FormErrorEvent, FormSubmitEvent } from '#ui/types'
import { showLoginModal, toggleLoginModal, closeLoginModal } from '~/scripts/loginModal'
import { isAuth, authUserId, trueIsAuth, toggleIsAuth, changeIsAuth, falseIsAuth, authUserIdChange, logout } from '~/scripts/auth'

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
    };
  },
  computed: {

  },
  mounted() {
    var isAuthValue = localStorage.getItem('isAuth');
    authUserIdChange(isAuthValue ?? '');
    changeIsAuth(isAuthValue !== null && !isNaN(Number(isAuthValue)));
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
                changeIsAuth(true);
                authUserIdChange(result.userId ?? '');
                closeLoginModal();
            } else {
                alert('Failed to login.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred while submitting the form.');
        }
    },
  }
}
>>>>>>> b02a3b396edd9b4bddd59e82c6036f2cd193a8a6
</script>

<style scoped>
/* Utility classes for responsive layout and better visuals */
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

<<<<<<< HEAD
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
</style>

<template>
  <main>
    <!-- Hero Section -->
    <section class="section">
      <div class="container flex flex-col lg:flex-row items-center gap-10">
=======
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
    <div v-show="showLoginModal" class="modal" @click.self="closeLoginModal">
      <div class="modal-content">
        <span class="close" @click="closeLoginModal">&times;</span>
        <h2 style="text-align: center;
    color: white;
    padding: 20px;
    margin: 0;" class="bg-orange-500">Login</h2>
        <div class="modal-body" style=" text-align: center;   padding: 20px;">
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
>>>>>>> b02a3b396edd9b4bddd59e82c6036f2cd193a8a6
        <div class="flex-1 order-2 lg:order-1 text-center lg:text-left">
          <h1 class="text-4xl lg:text-6xl font-extrabold mb-6 text-balance">
            Luxury Sneakers - Unleash Your Potential!
          </h1>
          <p class="text-xl lg:text-2xl mb-8 text-balance">
            Discover sneakers that will elevate your style and performance.
          </p>
<<<<<<< HEAD
          <button class="btn-orange">
            Browse Sneakers
          </button>
=======
          <button
          class="px-4 py-2 self-start bg-orange-200 rounded-md text-lg cursor-pointer btn-orange"
          @click="goToProductsPage"
        >
          Browse Sneakers
        </button>
>>>>>>> b02a3b396edd9b4bddd59e82c6036f2cd193a8a6
        </div>
        <div class="flex-1 order-1 lg:order-2">
          <NuxtImg class="w-100" src="/sneakers.webp" alt="Sneakers shop" />
        </div>
      </div>
    </section>

     <!-- New Arrivals Section -->
     <section class="new-arrivals section">
      <h2 class="section-title">New Arrivals</h2>
      <div class="product-grid">
        <!-- Example Product Item -->
        <div class="product-item">
          <NuxtImg class="product-image" src="#" alt="Sneaker 1" />
          <h3 class="product-name">Sneaker Model 1</h3>
          <p class="product-price">$120.00</p>
        </div>
        <div class="product-item">
          <NuxtImg class="product-image" src="#" alt="Sneaker 2" />
          <h3 class="product-name">Sneaker Model 2</h3>
          <p class="product-price">$150.00</p>
        </div>
        <div class="product-item">
          <NuxtImg class="product-image" src="#" alt="Sneaker 3" />
          <h3 class="product-name">Sneaker Model 3</h3>
          <p class="product-price">$130.00</p>
        </div>
        <!-- Add more products as needed -->
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories section">
      <h2 class="section-title">Shop By Category</h2>
      <div class="category-grid">
        <div class="category-item">Men</div>
        <div class="category-item">Women</div>
        <div class="category-item">Kids</div>
        <div class="category-item">Accessories</div>
      </div>
    </section>

    <!-- Promotions Section -->
    <section class="promotions section">
      <h2 class="section-title">Special Offers</h2>
      <p class="promotion-message">Get up to 50% off on selected items!</p>
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

    <!-- Newsletter Signup -->
    <section class="newsletter section">
      <h2 class="section-title">Subscribe to Our Newsletter</h2>
      <p>Get the latest updates and exclusive offers.</p>
      <input type="email" class="newsletter-input" placeholder="Enter your email" />
      <button class="btn-orange">Subscribe</button>
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
                    <a href="#"><img src="#" alt="Facebook"></a>
                    <a href="#"><img src="#" alt="Twitter"></a>
                    <a href="#"><img src="#" alt="Instagram"></a>
                </div>
                <p class="mt-4">&copy; 2024 Sneaker Shop. All rights reserved.</p>
            </div>
    </footer>
</template>
