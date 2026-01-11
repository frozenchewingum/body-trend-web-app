<script setup lang="ts">
definePageMeta({
  public: true
})
const { user, loading } = useAuth()

onMounted(async () => {
  // Minimum splash duration
  await new Promise(resolve => setTimeout(resolve, 1000))

  if (user.value) {
    navigateTo('/dashboard')
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
      <NuxtLoadingIndicator />
    </div>
  </div>
</template>