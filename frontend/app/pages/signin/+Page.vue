<template>
  <div></div>
</template>

<script lang="ts" setup>
import { navigate } from 'vike/client/router'
import { inject, onBeforeMount } from 'vue'

import AuthService from '#app/services/AuthService'
import { useAuthStore } from '#app/stores/authStore'
import GlobalErrorHandler from '#renderer/plugins/globalErrorHandler'

const authService = inject<AuthService>('authService')

const authStore = useAuthStore()

onBeforeMount(async () => {
  if (
    authStore.isLoggedIn &&
    authStore.user?.expires_at &&
    authStore.user.expires_at >= new Date().valueOf()
  ) {
    navigate('/app')
    return
  }
  try {
    await authService?.signIn()
    navigate('/app')
  } catch (error) {
    GlobalErrorHandler.error('auth error', error)
  }
})
</script>
