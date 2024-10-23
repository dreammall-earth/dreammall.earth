<template>
  <ul class="dropdown border-sm pa-3 pb-2 my-2 bg-dropdown-background">
    <li>
      <button data-test-theme-switch @click="toggleTheme">
        <v-icon :icon="isDarkTheme ? '$sun' : '$moon'"></v-icon>
        {{ isDarkTheme ? $t('menu.theme.light') : $t('menu.theme.dark') }}
      </button>
    </li>
    <li>
      <button class="sign-out" @click="signOut">
        <v-icon icon="mdi mdi-logout"></v-icon>{{ $t('buttons.signout') }}
      </button>
    </li>
    <li>
      <button>
        <v-icon icon="mdi mdi-email-multiple-outline"></v-icon>
        {{ $t('menu.invitationLinks') }}
      </button>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { useTheme } from 'vuetify'

import AuthService from '#src/services/AuthService'

const theme = useTheme()

const isDarkTheme = theme.global.current.value.dark

function toggleTheme() {
  theme.global.name.value = isDarkTheme ? 'light' : 'dark'
}

const authService = inject<AuthService>('authService')

async function signOut() {
  try {
    await authService?.signOut()
  } catch (cause) {
    throw new Error('auth error', { cause })
  }
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
