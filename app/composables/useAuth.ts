import type { User } from '@supabase/supabase-js'
import type { LoginCredential, SignupCredential } from '~/types/auth'

export const useAuth = () => {
  const supabase = useSupabaseClient()

  const user = useState<User | null>('auth-user', () => null)
  const loading = useState<boolean>('auth-loading', () => true)
  const initialized = useState<boolean>('auth-init', () => false)
  const isLoggedIn = computed(() => !!user.value)
  const init = async () => {
    if (initialized.value) return
    initialized.value = true
    loading.value = true

    const { data } = await supabase.auth.getSession()
    user.value = data.session?.user ?? null

    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
    })

    loading.value = false
  }

  const signUp = async ({ email, password }: SignupCredential) => {
    return supabase.auth.signUp({ email, password })
  }

  const signIn = async ({ email, password }: LoginCredential) => {
    const res = await supabase.auth.signInWithPassword({ email, password })
    user.value = res.data.user ?? null
    return res
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    user.value = null
  }

  return {
    user,
    loading,
    initialized,
    isLoggedIn,
    init,
    signUp,
    signIn,
    signOut
  }
}
