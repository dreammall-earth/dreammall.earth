<template>
  <DefaultLayout>
    <div class="container">
      <EmbeddedRoom :url="roomUrl.value" />
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { ref, watch } from 'vue'

import EmbeddedRoom from '#components/embedded-room/EmbeddedRoom.vue'
import DefaultLayout from '#layouts/DefaultLayout.vue'
import { JoinMyRoomQueryResult, joinMyRoomQuery } from '#queries/joinMyRoomQuery.js'

// const { roomUrl } = useMyRoom()

const { result: joinMyRoomQueryResult, error: joinMyRoomQueryError } =
  useQuery<JoinMyRoomQueryResult>(joinMyRoomQuery, null, {
    prefetch: false,
    fetchPolicy: 'no-cache',
  })

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

<style scoped>
.container {
  width: 100%;
  height: 80vh;
}
</style>
