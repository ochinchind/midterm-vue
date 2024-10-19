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
        class="border p-4 bg-white shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl cursor-pointer"
        @click="goToProductPage(product.id)"
      >
        <img :src="product.image" alt="Sneaker image" class="w-full h-40 object-cover rounded-t-lg mb-4" />
        <h2 class="text-lg font-semibold mb-2 text-gray-700">{{ product.name }}</h2>
        <p class="text-gray-500 mb-2">${{ product.price }}</p>

        <!-- Рейтинг товара с использованием звездочек -->
        <div class="flex items-center mb-4">
          <span v-for="n in 5" :key="n" class="text-yellow-400">
            <i v-if="n <= product.rating" class="fas fa-star"></i>
            <i v-else class="far fa-star"></i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const selectedPrice = ref('all')
const selectedRating = ref('all')
const router = useRouter()

const products = [
    { 
      id: 1, 
      name: "Nike Air Max 90", 
      price: 120, 
      image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa/w_450/global/380462/01/sv01/fnd/PNA/fmt/png", 
      rating: 4,
      description: "A comfortable, stylish sneaker with modern Air cushioning.",
      sizes: ['7', '8', '9', '10', '11'],
      colors: ['Red', 'Black', 'White'],
      gallery: [
        "https://avatars.mds.yandex.net/i?id=a2b6d19254384ab10082b5358dca140741b9dcd5-4549902-images-thumbs&n=13",
        "https://avatars.mds.yandex.net/i?id=e8c9049369929dae27602f13fe0f30d5-4405789-images-thumbs&n=13",
        "https://avatars.mds.yandex.net/i?id=fa3520103e4b3594452f0332b340aa5bc89b473f-10471476-images-thumbs&n=13"
      ],
      review: "A great sneaker for daily wear!"
    },
    { 
      id: 2, 
      name: "Adidas Ultraboost 21", 
      price: 180, 
      image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa/w_450/global/380462/01/sv01/fnd/PNA/fmt/png", 
      rating: 5,
      description: "The best running shoes, providing unparalleled comfort.",
      sizes: ['8', '9', '10', '11'],
      colors: ['Blue', 'White', 'Grey'],
      gallery: [
        "https://avatars.mds.yandex.net/i?id=a2b6d19254384ab10082b5358dca140741b9dcd5-4549902-images-thumbs&n=13",
        "https://avatars.mds.yandex.net/i?id=8cca5ccd69a9fd3d8648719c3c136915a67d5196-4120604-images-thumbs&n=13",
        "https://avatars.mds.yandex.net/i?id=8550db93fb84ba36e80ecc45d042818366f9d6c9-9146142-images-thumbs&n=13",
        "https://avatars.mds.yandex.net/i?id=41da2da91cd2182283cd724b59295348fc2056c5-4557823-images-thumbs&n=13"
        ],
        review: "Best running shoes I've ever had!"
      },
      { 
      id: 3, 
      name: "Adidas Ultraboost 22", 
      price: 50, 
      image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa/w_450/global/380462/01/sv01/fnd/PNA/fmt/png", 
      rating: 5,
      description: "The best running shoes, providing unparalleled comfort.",
      sizes: ['8', '9', '10', '11'],
      colors: ['Blue', 'White', 'Grey'],
      gallery: [
        "https://avatars.mds.yandex.net/i?id=a2b6d19254384ab10082b5358dca140741b9dcd5-4549902-images-thumbs&n=13",
        "https://avatars.mds.yandex.net/i?id=8cca5ccd69a9fd3d8648719c3c136915a67d5196-4120604-images-thumbs&n=13",
        "https://avatars.mds.yandex.net/i?id=8550db93fb84ba36e80ecc45d042818366f9d6c9-9146142-images-thumbs&n=13",
        "https://avatars.mds.yandex.net/i?id=41da2da91cd2182283cd724b59295348fc2056c5-4557823-images-thumbs&n=13"
        ],
        review: "Best running shoes I've ever had!"
      },
      { 
      id: 4, 
      name: "Adidas Ultraboost 25", 
      price: 20, 
      image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa/w_450/global/380462/01/sv01/fnd/PNA/fmt/png", 
      rating: 1,
      description: "The best running shoes, providing unparalleled comfort.",
      sizes: ['8', '9', '10', '11'],
      colors: ['Blue', 'White', 'Grey'],
      gallery: [
        "https://avatars.mds.yandex.net/i?id=a2b6d19254384ab10082b5358dca140741b9dcd5-4549902-images-thumbs&n=13",
        "https://avatars.mds.yandex.net/i?id=8cca5ccd69a9fd3d8648719c3c136915a67d5196-4120604-images-thumbs&n=13",
        "https://avatars.mds.yandex.net/i?id=8550db93fb84ba36e80ecc45d042818366f9d6c9-9146142-images-thumbs&n=13",
        "https://avatars.mds.yandex.net/i?id=41da2da91cd2182283cd724b59295348fc2056c5-4557823-images-thumbs&n=13"
        ],
        review: "Best running shoes I've ever had!"
      }
    ]

const goToProductPage = (id) => {
  router.push(`/product/${id}`)
}

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
