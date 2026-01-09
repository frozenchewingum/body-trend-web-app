<script setup lang="ts">
const { loading, isLoggedIn, signOut } = useAuth();
const logout = async () => {
  try {
    await signOut();
    navigateTo('/login')
  } catch(error: any) {

  }
}
</script>

<template>
  <UHeader :toggle="false">
    <template #right>
      <UColorModeButton variant="link" />

      <UButton
        v-if="!loading && isLoggedIn"
        variant="link"
        color="primary"
        @click="logout"
      >
        Logout
      </UButton>
    </template>
  </UHeader>
</template>