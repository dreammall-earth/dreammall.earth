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
    <v-row>
      <v-col>
        <a href="/room" class="room-button">
          <MainButton
            class="room-button"
            variant="fourth"
            :label="$t('buttons.toRoomIframe')"
            size="auto"
            >{{ $t('buttons.toRoomIframe') }}</MainButton
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
import { useQuery } from '@vue/apollo-composable'

import MainButton from '#components/buttons/MainButton.vue'
import DefaultLayout from '#layouts/DefaultLayout.vue'
import { joinMyRoomQuery } from '#queries/joinMyRoomQuery'
import { AUTH } from '#src/env'
import { useAuthStore } from '#stores/authStore'

const auth = useAuthStore()

const { result: joinMyRoomQueryResult, error: joinMyRoomQueryError } = useQuery(
  joinMyRoomQuery,
  null,
  {
    prefetch: false,
    fetchPolicy: 'no-cache',
  },
)

const enterRoom = async () => {
  if (joinMyRoomQueryError.value) {
    // eslint-disable-next-line no-console
    console.log(joinMyRoomQueryError.value.message)
  } else {
    window.open(joinMyRoomQueryResult.value?.joinMyRoom, '_blank')
  }
}

const enterAdmin = async () => {
  window.location.href = AUTH.ADMIN_REDIRECT_URI
}
</script>
