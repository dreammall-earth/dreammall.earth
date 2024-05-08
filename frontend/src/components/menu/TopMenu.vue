<template>
  <div class="top-menu mt-6 mt-sm-0">
    <v-app-bar flat class="py-4 app-bar" height="70px">
      <v-row>
        <v-col class="d-none d-sm-flex align-center">
          <MessageIndicator :number-of-messages="3" />
        </v-col>
        <v-col class="d-none d-sm-flex align-center">
          <a href="/" class="w-100 ml-8">
            <LogoImage size="small" />
          </a>
        </v-col>
        <v-col class="d-flex align-center">
          <TabControl />
        </v-col>
        <v-col class="d-none d-sm-flex align-center">
          <NewsIndicator :has-news="true" />
          <UserInfo user-name="Miro" />
        </v-col>
        <!--
        <v-col class="d-flex justify-end">
          <MainButton
            v-if="auth.isLoggedIn"
            class="sign-out mr-4"
            variant="third"
            label="Sign Out"
            size="auto"
            @click="signOut"
            >{{ $t('buttons.signout') }}
          </MainButton>
        </v-col>
        -->
      </v-row>
    </v-app-bar>
  </div>
</template>

<script lang="ts" setup>
// import { inject } from 'vue'

import LogoImage from '#components/menu/LogoImage.vue'
import MessageIndicator from '#components/messageIndicator/MessageIndicator.vue'
import NewsIndicator from '#components/newsIndicator/NewsIndicator.vue'

import TabControl from './TabControl.vue'
import UserInfo from './UserInfo.vue'

// import AuthService from '#src/services/AuthService'
// import { useAuthStore } from '#stores/authStore'

/*
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
*/
</script>

<style scoped lang="scss">
.app-bar {
  background: transparent !important;
  position: static !important;
}
.top-menu {
  position: sticky;
  top: 0;
  margin-top: 30px;
}
</style>
