<template>
  <div class="h-screen auth-page py-12">{{ $t('auth.content') }}</div>
</template>

<script lang="ts" setup>
import { navigate } from 'vike/client/router'
import { inject, onBeforeMount } from 'vue'

import AuthService from '#app/services/AuthService'
import GlobalErrorHandler from '#renderer/plugins/globalErrorHandler'

const authService = inject<AuthService>('authService')

onBeforeMount(async () => {
  try {
    const user = await authService?.signInCallback()
    if (!user) {
      throw new Error('Could not Sign In')
    }
    navigate('/app')
  } catch (error) {
    GlobalErrorHandler.error('auth error', error)
  }
})
</script>

<style scoped lang="scss">
.auth-page {
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
