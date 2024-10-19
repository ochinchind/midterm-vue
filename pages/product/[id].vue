<template>
    <div class="p-8 bg-gray-100 min-h-screen flex justify-center items-start mt-6">
      <div v-if="product" class="bg-white p-10 rounded-lg shadow-2xl max-w-5xl w-full flex">
  
        <!-- Секция миниатюр -->
        <div class="w-1/6 pr-4 flex flex-col space-y-4">
          <div v-for="(image, index) in product.gallery" :key="index" class="cursor-pointer">
            <img
              :src="image"
              :alt="'Image ' + (index + 1)"
              class="w-20 h-20 object-cover rounded-lg shadow-md"
              @click="updateMainImage(image)"
            />
          </div>
        </div>
  
        <!-- Основное изображение и информация о продукте -->
        <div class="w-5/6">
          <!-- Основное изображение -->
          <div class="mb-6">
            <img :src="currentImage" alt="Main product image" class="w-full h-96 object-cover rounded-lg shadow-lg" />
          </div>
  
          <!-- Название продукта -->
          <h1 class="text-4xl font-extrabold mb-6 text-center text-gray-800">{{ product.name }}</h1>
  
          <!-- Цена -->
          <p class="text-3xl font-bold text-green-600 mb-4 text-center">$ {{ product.price }}</p>
  
          <!-- Описание продукта -->
          <div class="bg-gray-50 p-6 rounded-lg shadow-lg mb-8">
            <h2 class="text-2xl font-semibold mb-4">Product Description</h2>
            <p class="text-gray-700 leading-relaxed">{{ product.description }}</p>
          </div>
  
          <!-- Выбор размеров и цветов -->
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
  
          <!-- Рейтинг с отзывами -->
          <div class="bg-gray-50 p-6 rounded-lg shadow-lg mb-8">
            <h2 class="text-2xl font-semibold mb-4">Customer Reviews</h2>
            <div class="flex items-center mb-4">
              <span v-for="n in 5" :key="n" class="text-yellow-400 text-xl">
                <i v-if="n <= product.rating" class="fas fa-star"></i>
                <i v-else class="far fa-star"></i>
              </span>
              <span class="ml-3 text-lg text-gray-500">{{ product.rating }} stars</span>
            </div>
            <p class="text-gray-600 italic">"{{ product.review }}"</p>
          </div>
  
          <!-- Кнопка покупки -->
          <button class="w-full py-4 bg-gradient-to-r from-blue-500 to-green-400 text-white rounded-lg font-semibold text-2xl hover:bg-green-500 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
      <div v-else>
        <p class="text-2xl font-bold text-red-500">Product not found.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router'
  import { ref } from 'vue'
  
  const route = useRoute()
  const productId = route.params.id
  
  // Массив продуктов с галереями, размерами, цветами и отзывами
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
    
  const product = ref(products.find(p => p.id == productId))
  const currentImage = ref(product.value.gallery[0])
  
  // Функция для обновления главного изображения
  const updateMainImage = (image) => {
    currentImage.value = image
  }
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
    margin-top:6rem;
  }
  button {
    font-size: 1.5rem;
    font-weight: bold;
    background: linear-gradient(90deg, rgba(72,149,239,1) 0%, rgba(0,212,255,1) 100%);
  }
  
  button:hover {
    background: linear-gradient(90deg, rgba(72,239,169,1) 0%, rgba(0,255,212,1) 100%);
  }
  </style>
  