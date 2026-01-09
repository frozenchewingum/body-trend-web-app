import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  modules: ['@nuxt/ui','@nuxtjs/supabase'],
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },  
  app: {
    head: {
      title: 'Body Trend Web App'
    }
  },
  supabase: {
    redirect: false
  }
})
