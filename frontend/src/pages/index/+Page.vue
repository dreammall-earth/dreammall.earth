<template>
  <DefaultLayout>
    <h1 class="d-flex justify-center">{{ $t('cafe.welcome') }}</h1>
    <v-row>
      <v-col>
        <MainButton
          class="room-button"
          variant="fourth"
          label="To Room"
          size="auto"
          @click="enterRoom"
          >{{ $t('buttons.toRoom') }}</MainButton
        >
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
import { useQuery } from '@vue/apollo-composable'

import MainButton from '#components/buttons/MainButton.vue'
import DefaultLayout from '#layouts/DefaultLayout.vue'
import { getRoomQuery } from '#queries/getRoomQuery'
import { AUTH } from '#src/env.js'
import { useAuthStore } from '#stores/authStore.js'

const auth = useAuthStore()

const { result: getRoomQueryResult, error: getRoomQueryError } = useQuery(getRoomQuery, null, {
  prefetch: false,
  fetchPolicy: 'no-cache',
})

const enterRoom = async () => {
  if (getRoomQueryError.value) {
    // eslint-disable-next-line no-console
    console.log(getRoomQueryError.value.message)
  } else {
    window.location.href = getRoomQueryResult.value?.getRoom
  }
}

const enterAdmin = async () => {
  window.location.href = AUTH.ADMIN_REDIRECT_URI
}
</script>
