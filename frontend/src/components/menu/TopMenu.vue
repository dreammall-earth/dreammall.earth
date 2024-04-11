<template>
  <div class="topmenu">
    <v-app-bar flat class="py-4" height="70px">
      <v-row>
        <v-col class="d-flex align-center">
          <a href="/" class="w-100 ml-8">
            <LogoImage class="" />
          </a>
        </v-col>
        <v-col class="d-flex justify-end">
          <MainButton
            v-if="auth.isLoggedIn"
            class="sign-out mr-4"
            variants="third"
            label="Sign Out"
            size="auto"
            @click="signOut"
            >{{ $t('buttons.signout') }}
          </MainButton>
        </v-col>
      </v-row>
    </v-app-bar>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue'

import MainButton from '#components/buttons/MainButton.vue'
import LogoImage from '#components/menu/LogoImage.vue'
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
