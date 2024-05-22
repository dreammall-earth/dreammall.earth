<template>
  <MainButton
    v-if="auth.isLoggedIn"
    class="sign-out mr-4"
    variant="third"
    label="Sign Out"
    size="auto"
    @click="signOut"
    >{{ $t('buttons.signout') }}
  </MainButton>
</template>

<script lang="ts" setup>
import { inject } from 'vue'

import MainButton from '#components/buttons/MainButton.vue'
import AuthService from '#src/services/AuthService'
import { useAuthStore } from '#stores/authStore'

const authService = inject<AuthService>('authService')

const auth = useAuthStore()

async function signOut() {
  try {
    await authService?.signOut()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('auth error', error)
  }
}
</script>
