<template>
  <div class="h-screen auth-page py-12">{{ $t('auth.content') }}</div>
</template>

<script lang="ts" setup>
import { navigate } from 'vike/client/router'
import { inject, onBeforeMount } from 'vue'

import GlobalErrorHandler from '#plugins/globalErrorHandler'
import AuthService from '#src/services/AuthService'

const authService = inject<AuthService>('authService')

onBeforeMount(async () => {
  try {
    await authService?.renewToken()
    navigate('/')
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
