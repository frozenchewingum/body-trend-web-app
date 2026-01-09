
import type { Database } from '~/types/database.types'

type UserProfile = Database['public']['Tables']['users']['Row']
type UserProfileInsert = Database['public']['Tables']['users']['Insert']
type UserProfileUpdate = Database['public']['Tables']['users']['Update']

export const useUserProfile = () => {
  const supabase = useSupabaseClient()
  const { user } = useAuth()

  // shared state
  const profile = useState<UserProfile | null>('user-profile', () => null)
  const loading = useState<boolean>('user-profile-loading', () => false)
  const error = useState<string | null>('user-profile-error', () => null)

  // ---------- READ ----------
  const fetchProfile = async () => {
    console.log(user.value)
    console.log('fetch')
    if (!user.value) return null

    loading.value = true
    error.value = null

    const { data, error: err } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.value.id)
      .maybeSingle()

    if (err) {
      error.value = err.message
      loading.value = false
      return null
    }

    profile.value = data
    loading.value = false
    return data
  }

  const createProfile = async (payload: Omit<UserProfileInsert, 'id'>) => {
    if (!user.value) throw new Error('Not authenticated')

    loading.value = true
    error.value = null

    const { data, error: err } = await supabase
      .from('users')
      .insert({
        ...payload,
        id: user.value.id
      })
      .select()
      .single()

    if (err) {
      error.value = err.message
      loading.value = false
      throw err
    }

    profile.value = data
    loading.value = false
    return data
  }

  // ---------- UPDATE ----------
  const updateProfile = async (payload: UserProfileUpdate) => {
    if (!user.value) throw new Error('Not authenticated')

    loading.value = true
    error.value = null

    const { data, error: err } = await supabase
      .from('users')
      .update(payload)
      .eq('id', user.value.id)
      .select()
      .single()

    if (err) {
      error.value = err.message
      loading.value = false
      throw err
    }

    profile.value = data
    loading.value = false
    return data
  }

  // ---------- DELETE ----------
  const deleteProfile = async () => {
    if (!user.value) throw new Error('Not authenticated')

    loading.value = true
    error.value = null

    const { error: err } = await supabase
      .from('users')
      .delete()
      .eq('id', user.value.id)

    if (err) {
      error.value = err.message
      loading.value = false
      throw err
    }

    profile.value = null
    loading.value = false
  }

  // ---------- UTILS ----------
  const clearProfile = () => {
    profile.value = null
    error.value = null
  }

  return {
    profile,
    loading,
    error,
    fetchProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    clearProfile
  }
}
