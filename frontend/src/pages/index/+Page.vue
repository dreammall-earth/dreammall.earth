<template>
  <DefaultLayout>
    <create-button />
  </DefaultLayout>
</template>

<script lang="ts" setup>
import { useQuery } from '@vue/apollo-composable'

import CreateButton from '#components/buttons/CreateButton.vue'
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
