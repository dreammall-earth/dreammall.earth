<template>
  <DefaultLayout>
    <div class="h-screen optin-page py-12">Logging in...</div>
  </DefaultLayout>
</template>

<script lang="ts" setup>
import { navigate } from 'vike/client/router'
import { inject, onBeforeMount } from 'vue'

import DefaultLayout from '#layouts/DefaultLayout.vue'
import AuthService from '#src/services/AuthService'
import { useAuthStore } from '#stores/authStore'

const authService = inject<AuthService>('authService')
const auth = useAuthStore()

onBeforeMount(async () => {
  try {
    const user = await authService?.signInCallback()
    if (!user) {
      throw new Error('Could not Sign In')
    }
    auth.save(user)
    navigate('/')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('auth error', error)
  }
})
</script>

<style scoped lang="scss">
.optin-page {
  display: flex;
  justify-content: center;

  p {
    display: flex;
    font-size: 1.5em;
    font-style: normal;
    font-weight: 700;
    line-height: 120%;
  }
}
</style>
