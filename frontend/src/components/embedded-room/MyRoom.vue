<template>
  <EmbeddedRoom v-if="roomUrl" :url="roomUrl" />
</template>

<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { watch, ref } from 'vue'

import { joinMyRoomQuery } from '#queries/joinMyRoomQuery'

import EmbeddedRoom from './EmbeddedRoom.vue'

const { result: joinMyRoomQueryResult, error: joinMyRoomQueryError } = useQuery(
  joinMyRoomQuery,
  null,
  {
    prefetch: false,
    fetchPolicy: 'no-cache',
  },
)

const roomUrl = ref<string | null>(null)

watch(joinMyRoomQueryResult, () => {
  if (joinMyRoomQueryResult.value) {
    roomUrl.value = joinMyRoomQueryResult.value.joinMyRoom
  }
})

watch(joinMyRoomQueryError, () => {
  if (joinMyRoomQueryError.value) {
    // eslint-disable-next-line no-console
    console.log(joinMyRoomQueryError.value.message)
  }
})
</script>
