<template>
  <div class="h-screen auth-page py-12">{{ $t('auth.signin') }}</div>
</template>

<script lang="ts" setup>
import { navigate } from 'vike/client/router'
import { inject, onBeforeMount } from 'vue'

import AuthService from '#src/services/AuthService'
import { useAuthStore } from '#stores/authStore'

const authService = inject<AuthService>('authService')

const authStore = useAuthStore()

onBeforeMount(async () => {
  if (authStore.isLoggedIn) {
    navigate('/')
    return
  }
  try {
    await authService?.signIn()
    navigate('/')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('auth error', error)
  }
})
</script>
