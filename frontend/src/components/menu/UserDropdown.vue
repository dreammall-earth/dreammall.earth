<template>
  <ul class="dropdown border-sm pa-3 pb-2 my-2 bg-dropdown-background">
    <li>
      <button class="sign-out" @click="signOut">
        <v-icon icon="$logout"></v-icon>{{ $t('buttons.signout') }}
      </button>
    </li>
    <li v-if="auth.isAdmin">
      <button class="admin-button" @click="enterAdmin">
        <v-icon icon="$logout"></v-icon>{{ $t('buttons.toAdmin') }}
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
  font-size: 14px;
  list-style: none;
  border-radius: 20px;
}

.dropdown li {
  padding: 5px;
}

.dropdown button {
  display: flex;
  align-items: center;
  width: 100%;
}

.dropdown button i {
  margin-top: -2px;
  margin-right: 8px;
}
</style>
