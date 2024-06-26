<template>
  <ul class="dropdown border-sm pa-2 my-2">
    <li class="dropdown-element">
      <button @click="signOut"><v-icon icon="$logout"></v-icon> {{ $t('buttons.signout') }}</button>
    </li>
    <li v-if="auth.isAdmin">
      <button @click="enterAdmin">
        <v-icon icon="$admin"></v-icon>{{ $t('buttons.toAdmin') }}
      </button>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { inject } from 'vue'

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

<style scoped lang="scss">
.dropdown {
  list-style: none;
  padding: 0;
  margin: 0;
  border-radius: 20px;
  background: #3d4753;
  font-size: 14px;
}
.dropdown-element {
  padding: 5px;
}
</style>
