<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'

const { createProfile, loading, error } = useUserProfile()

const form = reactive({
  first_name: '',
  last_name: '',
  birth_date: '',
  gender: '',
  height_cm: null as number | null
})

const submitting = ref(false)

const submit = async (event: FormSubmitEvent<typeof form>) => {
  submitting.value = true
  try {
    await createProfile({
      first_name: form.first_name,
      last_name: form.last_name,
      birth_date: form.birth_date,
      gender: form.gender,
      height_cm: form.height_cm!
    })

    // after successful creation
    await navigateTo('/')
  } catch (e) {
    console.error(e)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-12">
    <UCard>
      <template #header>
        <h1 class="text-xl font-semibold">
          Create Your Profile
        </h1>
      </template>

      <UForm
        :state="form"
        class="space-y-4"
        @submit="submit"
      >
        <UFormField  label="First Name" name="first_name" required>
          <UInput v-model="form.first_name" />
        </UFormField >

        <UFormField  label="Last Name" name="last_name" required>
          <UInput v-model="form.last_name" />
        </UFormField >

        <UFormField  label="Birth Date" name="birth_date" required>
          <UInput
            v-model="form.birth_date"
            type="date"
          />
        </UFormField >

        <UFormField  label="Gender" name="gender" required>
          <USelect
            v-model="form.gender"
            :items="['male', 'female', 'other']"
            placeholder="Select gender"
          />
        </UFormField >

        <UFormField  label="Height (cm)" name="height" required>
          <UInput
            v-model.number="form.height_cm"
            type="number"
            min="50"
            max="250"
          />
        </UFormField >

        <UAlert
          v-if="error"
          color="error"
          variant="soft"
        >
          {{ error }}
        </UAlert>

        <div class="flex justify-end">
          <UButton
            type="submit"
            color="primary"
            :loading="submitting || loading"
          >
            Create Profile
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
