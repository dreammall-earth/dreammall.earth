<template>
  <MainButton class="sign-out mr-4" variant="third" label="Sign Out" size="auto" @click="signOut"
    >{{ $t('buttons.signout') }}
  </MainButton>
  <MainButton
    v-if="auth.isAdmin"
    class="admin-button mr-4"
    variant="third"
    label="To Admin"
    size="auto"
    @click="enterAdmin"
  >
    {{ $t('buttons.toAdmin') }}
  </MainButton>
</template>

<script lang="ts" setup>
import { inject } from 'vue'

import MainButton from '#components/buttons/MainButton.vue'
import GlobalErrorHandler from '#plugins/globalErrorHandler'
import { AUTH } from '#src/env'
import AuthService from '#src/services/AuthService'
import { useAuthStore } from '#stores/authStore'

const authService = inject<AuthService>('authService')

const auth = useAuthStore()

async function signOut() {
  try {
    await authService?.signOut()
  } catch (error) {
    GlobalErrorHandler.error('auth error', error)
  }
}

const enterAdmin = async () => {
  window.location.href = AUTH.ADMIN_REDIRECT_URI
}
</script>
