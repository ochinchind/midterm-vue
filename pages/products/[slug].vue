<template>
    <div>
      <h1>{{ categoryName }} Products</h1>
      <!-- List products here -->
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  const categoryName = route.params.slug // Get the category name from the URL
  </script>
  