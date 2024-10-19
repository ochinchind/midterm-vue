// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    "@nuxt/ui",
    "@nuxt/image",
    "@nuxt/icon",
    "@nuxtjs/google-fonts"
  ],

  css: [
    '@fortawesome/fontawesome-free/css/all.css'
  ],

  compatibilityDate: "2024-10-19"
})