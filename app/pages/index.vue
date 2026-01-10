<script setup lang="ts">
definePageMeta({
  public: true
})
const { user, loading } = useAuth()

onMounted(async () => {
  // Minimum splash duration
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Wait until auth is ready
  // while (!loading.value) {
  //   await new Promise(resolve => setTimeout(resolve, 50))
  // }

  if (user.value) {
    navigateTo('/')
  } else {
    navigateTo('/login')
  }
})
</script>

<template>
  <div class="flex h-screen items-center justify-center">
    <div class="text-center space-y-4">
      <UIcon name="i-lucide-heart-pulse" class="text-primary text-5xl" />
      <p class="text-lg font-medium">Loading your health dashboard…</p>
      <USpinner size="lg" />
    </div>
  </div>
</template>