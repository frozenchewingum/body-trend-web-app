<script lang="ts" setup>

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

</script>
<template>
  <div class="sign-up-view">
    <UAuthForm title="Sign Up" :fields="fields" class="max-w-sm" @submit="onSubmit"></UAuthForm>
  </div>
</template>
<style></style>