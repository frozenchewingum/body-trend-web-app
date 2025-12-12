<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()


const sign = ref<'in' | 'up'>('in')

watchEffect(() => {
  if (user.value) {
    return navigateTo('/')
  }
})

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

const signIn = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
 
}

const signUp = async (email: string, password: string) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  })
  // confirm email before login
    //await signIn(email, password)
}

async function onSubmit(payload: any) {
  const email = payload.data.email
  const password = payload.data.password

  if (sign.value === 'in') await signIn(email, password)
  else await signUp(email, password);
}

</script>

<template>
  <UContainer class="h-[calc(100vh-var(--ui-header-height))] flex items-center justify-center px-4">
    <UPageCard class="max-w-sm w-full">
      <UAuthForm
        :title="sign === 'in' ? 'Login' : 'Sign up'"
        icon="i-lucide-user"
        :fields="fields"
        @submit="onSubmit"
      >
        <template
          #description
        >
          {{ sign === 'up' ? 'Already have an account?' : 'Don\'t have an account?' }}
          <UButton
            variant="link"
            class="p-0"
            @click="sign = sign === 'up' ? 'in' : 'up'"
          >
            {{ sign === 'in' ? 'Sign up' : 'Sign in' }}
          </UButton>.
        </template>
      </UAuthForm>
    </UPageCard>
  </UContainer>
</template>