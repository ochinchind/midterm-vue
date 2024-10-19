<template>
  <div class="p-8 bg-gray-100 min-h-screen mt-6">
    <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">Available Sneakers</h1>

    <!-- Фильтры -->
    <div class="flex justify-between mb-6">
      <!-- Фильтр по цене -->
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
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <div
        v-for="(product, index) in filteredProducts"
        :key="index"
        class="border p-4 bg-white shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl"
      >
        <img :src="product.image" alt="Sneaker image" class="w-full h-40 object-cover rounded-t-lg mb-4" />
        <h2 class="text-lg font-semibold mb-2 text-gray-700">{{ product.name }}</h2>
        <p class="text-gray-500 mb-2">{{ product.price }}</p>

        <!-- Рейтинг товара -->
        <div class="flex items-center mb-4">
          <span v-for="n in 5" :key="n" class="text-yellow-400">
            <i v-if="n <= product.rating" class="fas fa-star"></i>
            <i v-else class="far fa-star"></i>
          </span>
          <span class="ml-2 text-gray-500">{{ product.rating }} stars</span>
        </div>

        <button class="w-full py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
          Buy Now
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedPrice = ref('all')
const selectedRating = ref('all')

const products = [
  { name: "Nike Air Max 90", price: 120, image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_450,h_450/global/380462/01/sv01/fnd/PNA/fmt/png", rating: 4 },
  { name: "Adidas Ultraboost 21", price: 180, image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_450,h_450/global/380462/01/sv01/fnd/PNA/fmt/png", rating: 5 },
  { name: "Puma RS-X", price: 110, image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_450,h_450/global/380462/01/sv01/fnd/PNA/fmt/png", rating: 4 },
  { name: "Reebok Classic Leather", price: 85, image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_450,h_450/global/380462/01/sv01/fnd/PNA/fmt/png", rating: 3 },
  { name: "Converse Chuck Taylor", price: 65, image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_450,h_450/global/380462/01/sv01/fnd/PNA/fmt/png", rating: 2 },
  { name: "New Balance 574", price: 100, image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_450,h_450/global/380462/01/sv01/fnd/PNA/fmt/png", rating: 4 },
  { name: "Nike Air Force 1", price: 90, image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_450,h_450/global/380462/01/sv01/fnd/PNA/fmt/png", rating: 5 },
  { name: "Adidas NMD R1", price: 130, image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_450,h_450/global/380462/01/sv01/fnd/PNA/fmt/png", rating: 3 },
  { name: "Vans Old Skool", price: 70, image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_450,h_450/global/380462/01/sv01/fnd/PNA/fmt/png", rating: 2 },
  { name: "Asics Gel-Lyte III", price: 110, image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_450,h_450/global/380462/01/sv01/fnd/PNA/fmt/png", rating: 4 },
]

// Фильтрация товаров по цене и рейтингу
const filteredProducts = computed(() => {
  return products.filter(product => {
    const meetsPriceCriteria = selectedPrice.value === 'all' || (
      selectedPrice.value === '50-100' && product.price >= 50 && product.price <= 100
      || selectedPrice.value === '100-150' && product.price >= 100 && product.price <= 150
      || selectedPrice.value === '150-200' && product.price >= 150 && product.price <= 200
    )

    const meetsRatingCriteria = selectedRating.value === 'all' || product.rating >= parseInt(selectedRating.value)

    return meetsPriceCriteria && meetsRatingCriteria
  })
})
</script>

<style scoped>
.container {
  margin-top: 120px; /* Настраиваем отступ сверху */
}
.mt-6 {
  margin-top:6rem;
}
</style>
