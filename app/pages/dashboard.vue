<script setup lang="ts">
definePageMeta({
    middleware: ['profile-creation']
})
import { ref, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useUserProfile } from '~/composables/useUserProfile'
import { useOverlay, useToast } from '#imports'
import { AddMetricModal } from '#components'
import type { BodyMetricInsert } from '~/types/bodyMetric'
import type { TableColumn } from '@nuxt/ui'

const { user, initialized } = useAuth()
const { profile, fetchProfile } = useUserProfile()

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

watchEffect(loadData)

// Open the Add Metric modal
const openMetricModal = async () => {
    if (!user.value) return

    const instance = metricModal.open({
        metric: {
            user_id: user.value.id,
            weight_kg: null,
            bmi: null,
            body_fat_percent: null,
            body_water_percent: null,
            muscle_mass_kg: null,
            bone_mass_kg: null,
            visceral_fat: null,
            basal_metabolic_rate: null,
            metabolic_age: null,
            recorded_at: new Date().toISOString().slice(0, 10),
        } as BodyMetricInsert
    })

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

const columns: TableColumn<any>[] = [
    { accessorKey: 'recorded_at', header: 'Date' },
    { accessorKey: 'weight_kg', header: 'Weight (kg)' },
    { accessorKey: 'bmi', header: 'BMI' },
    { accessorKey: 'body_fat_percent', header: 'Body Fat %' },
    { accessorKey: 'muscle_mass_kg', header: 'Muscle Mass (kg)' },
    { accessorKey: 'bone_mass_kg', header: 'Bone Mass (kg)' },
    { accessorKey: 'visceral_fat', header: 'Visceral Fat' }
]
</script>

<template>
    <div class="space-y-8 p-6">
        <!-- Profile Card -->
        <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold">Welcome, {{ profile?.first_name ?? 'User' }}</h2>
                <UButton label="Edit Profile" color="primary" variant="outline" @click="navigateEditProfile" />
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div><strong>Full Name:</strong> {{ profile?.first_name }} {{ profile?.last_name }}</div>
                <div><strong>Gender:</strong> {{ profile?.gender }}</div>
                <div><strong>Birth Date:</strong> {{ profile?.birth_date }}</div>
                <div><strong>Height (cm):</strong> {{ profile?.height_cm }}</div>
            </div>
        </div>

        <!-- Body Metrics -->
        <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold">Body Metrics</h2>
                <UButton label="Add Metric" color="primary" @click="openMetricModal" />
            </div>

            <div v-if="loadingMetrics" class="text-center text-gray-500">Loading metrics...</div>

            <UTable v-if="!loadingMetrics" :data="bodyMetrics" :columns="columns" row-key="id" striped hover>
                <!-- Custom cell slots if needed -->
                <template #recorded_at-cell="{ row }">
                    {{ row.original.recorded_at }}
                </template>

                <template #weight_kg-cell="{ row }">
                    {{ row.original.weight_kg ?? '-' }}
                </template>

                <template #bmi-cell="{ row }">
                    {{ row.original.bmi ?? '-' }}
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
