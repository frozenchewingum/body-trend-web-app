<script lang="ts" setup>
definePageMeta({
  public: true
})
import type { AuthFormField } from '@nuxt/ui';
import type { SignupCredential } from '~/types/auth';
const supabase = useSupabaseClient()

const { signUp } = useAuth();

const fields = ref<AuthFormField[]>([
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    required: true
  },
  {
    name: 'confirmPassword',
    type: 'password',
    label: 'Confirm Password',
    placeholder: 'Confirm your password',
    required: true
  }
])

const onSubmit = async (payload: any) => {
  await signUp(payload.data as SignupCredential);
}
const navigateLogin = () => {
  navigateTo('/login');
}
</script>
<template>
  <div class="sign-up-view">
    <UContainer class="h-[calc(100vh-var(--ui-header-height))] flex items-center justify-center px-4">
      <UPageCard class="max-w-sm w-full">
        <UAuthForm title="Sign Up" icon="i-lucide-user" :fields="fields" class="max-w-sm" @submit="onSubmit">
          <template #description>
            {{ 'Already have an account?' }}
            <UButton variant="link" class="p-0" @click="navigateLogin" label="Login">
            </UButton>.
          </template>
        </UAuthForm>
      </UPageCard>
    </UContainer>
  </div>
</template>
<style></style>