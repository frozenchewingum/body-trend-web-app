<script setup lang="ts">
definePageMeta({
    middleware: ['profile-creation']
})
import { ref, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useUserProfile } from '~/composables/useUserProfile'
import { useOverlay, useToast } from '#imports'
import { AddMetricModal } from '#components'
import type { BodyMetric } from '~/types/bodyMetric'
import type { TableColumn } from '@nuxt/ui'

const { user, initialized } = useAuth()
const { profile, fetchProfile } = useUserProfile()
const { metrics, fetchMetrics } = useBodyMetrics();

// Toast & overlay
const toast = useToast()
const overlay = useOverlay()
const metricModal = overlay.create(AddMetricModal)

// Loading & state
const bodyMetrics = ref<Array<any>>([])
const loadingMetrics = ref(false)
const submittingMetric = ref(false)

// Fetch profile & metrics when auth is ready
const loadData = async () => {
    if (!initialized.value || !user.value) return
    await fetchProfile()
    // TODO: replace with your Supabase fetch body metrics
    loadingMetrics.value = true
    // Example: fetch all metrics for the user
    const { data } = await useSupabaseClient()
        .from('body_metrics')
        .select('*')
        .eq('user_id', user.value.id)
        .order('recorded_at', { ascending: false })
    bodyMetrics.value = data ?? []
    loadingMetrics.value = false
}

watchEffect(async () => {
    await fetchProfile()
    loadingMetrics.value = true;
    await fetchMetrics().finally(() => {
        loadingMetrics.value = false;
    })


})

// Open the Add Metric modal
const openMetricModal = async () => {
    if (!user.value) return

    const instance = metricModal.open()

    const saved = await instance.result
    if (saved) {
        toast.add({ title: 'Metric saved!', color: 'success', id: 'metric-success' })
        await loadData() // reload metrics
    } else {
        toast.add({ title: 'Metric dismissed', color: 'neutral', id: 'metric-dismiss' })
    }
}

// Navigate to Edit Profile page
const navigateEditProfile = () => {
    navigateTo('/profile/edit')
}
type DataMetricColumn = Omit<TableColumn<BodyMetric>, 'accessorKey' | 'id'> & {
  accessorKey: keyof BodyMetric
}

type DisplayMetricColumn = Omit<TableColumn<BodyMetric>, 'accessorKey'> & {
  id: string
  accessorKey?: never
}

export type MetricColumn = DataMetricColumn | DisplayMetricColumn
const columns: MetricColumn[] = [
    { accessorKey: 'recorded_at', header: 'Date' },
    { accessorKey: 'weight_kg', header: 'Weight (kg)' },
    { accessorKey: 'body_fat_percent', header: 'Body Fat %' },
    { accessorKey: 'visceral_fat', header: 'Visceral Fat' },
    { accessorKey: 'bone_mass_kg', header: 'Bone Mass (kg)' },
    { accessorKey: 'basal_metabolic_rate', header: 'Muscle Mass (kg)' },
    { accessorKey: 'muscle_mass_kg', header: 'Muscle Mass (kg)' },
    { accessorKey: 'body_water_percent', header: 'Muscle Mass (kg)' },
    { accessorKey: 'physique_rating', header: 'Physique Rating' },
]
</script>

<template>
    <div class="space-y-8 p-6">
        <!-- Profile Card -->
        <div class="p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold">Welcome, {{ profile?.first_name ?? 'User' }}</h2>
                <UButton label="Edit Profile" color="primary" variant="outline" @click="navigateEditProfile" />
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div><strong>Full Name:</strong> {{ profile?.first_name }} {{ profile?.last_name }}</div>
                <div><strong>Gender:</strong> {{ profile?.gender }}</div>
                <div><strong>Birth Date:</strong> {{ profile?.birth_date }}</div>
                <div><strong>Height:</strong> {{ profile?.height_cm }} cm</div>
            </div>
        </div>

        <!-- Body Metrics -->
        <div class="p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold">Body Metrics</h2>
                <UButton label="Add Metric" color="primary" @click="openMetricModal" />
            </div>

            <div v-if="loadingMetrics" class="text-center text-gray-500">Loading metrics...</div>

            <UTable v-if="!loadingMetrics && metrics.length > 0" :data="metrics" :columns="columns" row-key="id" striped
                hover>
                <!-- Custom cell slots if needed -->
                <template #recorded_at-cell="{ row }">
                    <NuxtTime v-if="row.original.recorded_at" :datetime="row.original.recorded_at" />
                </template>

                <template #weight_kg-cell="{ row }">
                    {{ row.original.weight_kg ?? '-' }}
                </template>

                <template #physique-rating-cell="{ row }">
                    {{ row.original.physique_rating ?? '-' }}
                </template>

                <template #body_fat_percent-cell="{ row }">
                    {{ row.original.body_fat_percent ?? '-' }}
                </template>

                <template #muscle_mass_kg-cell="{ row }">
                    {{ row.original.muscle_mass_kg ?? '-' }}
                </template>

                <template #bone_mass_kg-cell="{ row }">
                    {{ row.original.bone_mass_kg ?? '-' }}
                </template>

                <template #visceral_fat-cell="{ row }">
                    {{ row.original.visceral_fat ?? '-' }}
                </template>
            </UTable>


        </div>
    </div>
</template>
