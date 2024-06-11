<template>
  <div></div>
</template>

<script lang="ts" setup>
import { navigate } from 'vike/client/router'
import { inject, onBeforeMount } from 'vue'

import GlobalErrorHandler from '#plugins/GlobalErrorHandler'
import AuthService from '#src/services/AuthService'
import { useAuthStore } from '#stores/authStore'

const authService = inject<AuthService>('authService')

const authStore = useAuthStore()

onBeforeMount(async () => {
  if (
    authStore.isLoggedIn &&
    authStore.user?.expires_at &&
    authStore.user.expires_at >= new Date().valueOf()
  ) {
    navigate('/')
    return
  }
  try {
    await authService?.signIn()
    navigate('/')
  } catch (error) {
    GlobalErrorHandler.error('auth error', error)
  }
})
</script>
