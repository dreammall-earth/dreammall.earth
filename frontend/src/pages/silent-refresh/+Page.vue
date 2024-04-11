<template>
  <DefaultLayout>
    <div class="h-screen auth-page py-12">{{ $t('auth.content') }}</div>
  </DefaultLayout>
</template>

<script lang="ts" setup>
import { navigate } from 'vike/client/router'
import { inject, onBeforeMount } from 'vue'

import DefaultLayout from '#layouts/DefaultLayout.vue'
import AuthService from '#src/services/AuthService'
import { useAuthStore } from '#stores/authStore.js'

const authService = inject<AuthService>('authService')
const auth = useAuthStore()

onBeforeMount(async () => {
  try {
    await authService?.renewToken()
    auth.save((await authService?.getUser()) || null)
    navigate('/')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('auth error', error)
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
