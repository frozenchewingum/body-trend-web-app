// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const { user, loading } = useAuth()

  // If route doesn't exist, do nothing (Nuxt will render error.vue)
  if (to.matched.length === 0) return

  // Define public routes
  if (to.meta.public) return


  // Wait until auth is initialized
  if (!loading.value) return

  // Redirect if not logged in
  if (!user.value) {
    return navigateTo('/login')
  }
})
