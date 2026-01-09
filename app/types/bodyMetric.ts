import type { Database } from '~/types/database.types'

export type BodyMetric = Database['public']['Tables']['body_metrics']['Row']
export type BodyMetricInsert = Database['public']['Tables']['body_metrics']['Insert']