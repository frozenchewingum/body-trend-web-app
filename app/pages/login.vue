<script setup lang="ts">

import type { LoginCredential } from '~/types/auth';
import * as z from 'zod';

const { signIn } = useAuth();
const fields = [{
  name: 'email',
  type: 'text' as const,
  label: 'Email',
  placeholder: 'Enter your email',
  required: true,
}, {
  name: 'password',
  label: 'Password',
  type: 'password' as const,
  placeholder: 'Enter your password',
}]

// const providers = [{
//   label: 'GitHub',
//   icon: 'i-simple-icons-github',
//   onClick: async () => {
//     const { error } = await supabase.auth.signInWithOAuth({
//       provider: 'github',
//       options: {
//         redirectTo: 'https://supabase-demo-gamma.vercel.app/confirm',
//       },
//     })

//   },
// }]

const onSubmit = async (payload: any) => {
  try {
    await signIn(payload.data as LoginCredential);
    console.log('navigate')
    navigateTo('/');
  } catch(error: any)  {
    console.log(error)
  }
  
}

const navigateSignup = () => {
  navigateTo('/signup');
}

</script>

<template>
  <UContainer class="h-[calc(100vh-var(--ui-header-height))] flex items-center justify-center px-4">
    <UPageCard class="max-w-sm w-full">
      <UAuthForm
        title="Login"
        icon="i-lucide-user"
        :fields="fields"
        @submit="onSubmit"
      >
        <template
          #description
        >
          {{'Don\'t have an account?'}}
          <UButton
            variant="link"
            class="p-0"
            @click="navigateSignup"
            label="Sign Up"
          >
          </UButton>.
        </template>
      </UAuthForm>
    </UPageCard>
  </UContainer>
</template>