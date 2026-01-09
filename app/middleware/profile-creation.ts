export default defineNuxtRouteMiddleware(async (to) => {
  const { user, loading } = useAuth()
  const supabase = useSupabaseClient()

  // wait for auth
  if (loading.value) return

  // auth middleware should handle this, but be safe
  if (!user.value) return

  // allow profile creation page
  if (to.path === '/profile/create') return

  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.value.id)
    .maybeSingle()

  // no profile row → redirect
  if (!data) {
    return navigateTo('/profile/create')
  }
})
