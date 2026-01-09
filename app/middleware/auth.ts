export default defineNuxtRouteMiddleware((to) => {
  const { user, loading } = useAuth()
console.log({
  path: to.path,
  user: user.value,
  loading: loading.value
})
  if (loading.value) return

  if (!user.value) {
    return navigateTo('/login')
  } 
})
