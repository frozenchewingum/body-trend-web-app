// composables/useBodyMetrics.ts
import type { BodyMetric, BodyMetricInsert } from '~/types/bodyMetric'

export const useBodyMetrics = () => {
  const supabase = useSupabaseClient()
  const { user } = useAuth()

  const metrics = useState<BodyMetric[]>('body-metrics', () => [])
  const loading = useState<boolean>('body-metrics-loading', () => false)
  const error = useState<string | null>('body-metrics-error', () => null)

  const fetchMetrics = async () => {
    if (!user.value) return
    loading.value = true
    const { data, error: err } = await supabase
      .from('body_metrics')
      .select('*')
      .eq('user_id', user.value.id)
      .order('recorded_at', { ascending: false })

    if (err) {
      error.value = err.message
    } else {
      metrics.value = data ?? []
    }
    loading.value = false
  }

  const addMetric = async (payload: Omit<BodyMetricInsert, 'user_id'>) => {
    if (!user.value) throw new Error('Not authenticated')
    const { data, error: err } = await supabase
      .from('body_metrics')
      .insert({ ...payload, user_id: user.value.id })
      .select()
      .single()
    if (err) throw err
    metrics.value.unshift(data)
    return data
  }

  return { metrics, loading, error, fetchMetrics, addMetric }
}
