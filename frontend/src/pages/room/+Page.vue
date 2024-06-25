<template>
  <DefaultLayout>
    <div class="container">
      <EmbeddedRoom :url="roomUrl" />
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'

import EmbeddedRoom from '#components/embedded-room/EmbeddedRoom.vue'
import DefaultLayout from '#layouts/DefaultLayout.vue'
import { useActiveRoomStore } from '#stores/activeRoomStore'

const activeRoomStore = useActiveRoomStore()

const roomUrl = ref<string | null>(null)

watch(activeRoomStore, () => {
  roomUrl.value = activeRoomStore?.activeRoom
})
</script>

<style scoped>
.container {
  width: 100%;
  height: 80vh;
}
</style>
