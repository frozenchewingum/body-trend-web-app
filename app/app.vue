<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
})

const title = 'Body Trend Web App'
const description = 'A simple wellness app to keep track body trends'

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
})

const { init } = useAuth();
onMounted(() => {
  init();
})
</script>