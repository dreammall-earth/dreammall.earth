<template>
  <div></div>
</template>

<script lang="ts" setup>
import { navigate } from 'vike/client/router'
import { inject, onBeforeMount } from 'vue'

import { usePageContext } from '#context/usePageContext'
import AuthService from '#src/services/AuthService'
import { useAuthStore } from '#stores/authStore'

const authService = inject<AuthService>('authService')

const authStore = useAuthStore()

const pageContext = usePageContext()

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
    const redirectTo = pageContext.urlParsed.search.previousUrl
    await authService?.signIn(redirectTo)
    navigate('/')
  } catch (cause) {
    throw new Error('auth error', { cause })
  }
})
</script>
