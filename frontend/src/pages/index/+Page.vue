<template>
  <DefaultLayout>
    <h1 class="d-flex justify-center">{{ $t('cafe.welcome') }}</h1>
    <v-row>
      <v-col>
        <a href="/room" class="room-button">
          <MainButton
            class="room-button"
            variant="fourth"
            :label="$t('buttons.toRoom')"
            size="auto"
            >{{ $t('buttons.toRoom') }}</MainButton
          >
        </a>
      </v-col>
    </v-row>
    <v-row v-if="auth.isAdmin">
      <v-col>
        <MainButton
          class="admin-button"
          variant="primary"
          label="To Admin"
          size="auto"
          @click="enterAdmin"
          >{{ $t('buttons.toAdmin') }}</MainButton
        >
      </v-col>
    </v-row>
  </DefaultLayout>
</template>

<script lang="ts" setup>
import MainButton from '#components/buttons/MainButton.vue'
import DefaultLayout from '#layouts/DefaultLayout.vue'
import { AUTH } from '#src/env'
import { useAuthStore } from '#stores/authStore'

const auth = useAuthStore()

const enterAdmin = async () => {
  window.location.href = AUTH.ADMIN_REDIRECT_URI
}
</script>
