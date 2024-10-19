<script setup lang="ts">

</script>

<style>
.w-100 {
    width: 100%;
}

.btn-orange:hover{
    background-color: rgb(251 146 60);
}
</style>

<template>
    <main>
    <section >
      <div class="container flex flex-col lg:flex-row items-center py-20 gap-10">
        <div class="flex-1 order-2 lg:order-1 text-center lg:text-left">
          <h1 class="text-4xl lg:text-6xl font-extrabold mb-6 text-balance">
            Luxury sneakers Unleash your potential!
          </h1>
          <p class="text-xl lg:text-2xl mb-8 text-balance">
            Discover sneakers that will lead you to success
          </p>
          <button
            class="px-4 py-2 self-start bg-orange-200 rounded-md text-lg cursor-pointer btn-orange"
          >
            Browse Sneakers
          </button>
        </div>
        <div class="flex-1 order-1 lg:order-2">
          <NuxtImg
            class="w-100"
            src="/sneakers.webp"
            alt="Sneakers shop"
          />
        </div>
      </div>
    </section>
    
  </main>
</template>