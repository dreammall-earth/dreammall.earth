<template>
  <DefaultLayout>
    <div class="container">
      <EmbeddedRoom :url="roomUrl" />
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import EmbeddedRoom from '#components/embedded-room/EmbeddedRoom.vue'
import DefaultLayout from '#layouts/DefaultLayout.vue'
import { useActiveRoomStore } from '#stores/activeRoomStore'

const activeRoomStore = useActiveRoomStore()

const { activeRoom: roomUrl } = storeToRefs(activeRoomStore)
</script>

<style scoped>
.container {
  width: 100%;
  height: 80vh;
}
</style>
