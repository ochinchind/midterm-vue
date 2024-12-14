<script setup lang="ts">
import { useRouter } from 'vue-router';
import FavMixin from '~/mixins/favMixin';

defineOptions({
  mixins: [FavMixin], // Include the mixin for shared functionality
});

const router = useRouter();

onMounted(() => {
  console.log('Favorites page mounted');
});
</script>

<template>
  <div class="p-8 bg-gray-100 min-h-screen mt-6">
    <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">Your Favorites List</h1>

    <div v-if="productDetails && productDetails.length > 0" class="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <div class="space-y-6">
        <div
          v-for="item in productDetails"
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

          <button @click="removeFromFavorites(item)" class="text-red-500 hover:text-red-700 font-semibold">
            Remove
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-lg font-semibold text-gray-500 mt-20">
      Your favorites list is empty.
      <router-link to="/products" class="text-blue-500 hover:underline">Take a look at our offers</router-link>
    </div>
  </div>
</template>

<style scoped>
.mt-6 {
  margin-top: 6rem;
}
</style>