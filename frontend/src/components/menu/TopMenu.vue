<template>
  <v-app-bar flat>
    <v-row>
      <v-col>
        <v-btn
          v-if="auth.isLoggedIn"
          class="sign-out"
          variants="outlined"
          label="Sign Out"
          size="auto"
          @click="signOut"
          >{{ $t('buttons.signout') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { inject } from 'vue'

import AuthService from '#src/services/AuthService'
import { useAuthStore } from '#stores/authStore'

const authService = inject<AuthService>('authService')
const auth = useAuthStore()

async function signOut() {
  try {
    await authService?.signOut()
    auth.clear()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('auth error', error)
  }
}
</script>
