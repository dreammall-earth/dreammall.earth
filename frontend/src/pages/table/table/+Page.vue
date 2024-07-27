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

<style scoped lang="scss">
@import 'vuetify/lib/styles/settings/_variables';

.container {
  --bottom-height: 16px;

  width: 100%;
  height: calc(100vh - var(--v-layout-top) - var(--bottom-height));
}

@media #{map-get($display-breakpoints, 'sm-and-down')} {
  .container {
    --bottom-height: 85px;
  }
}
</style>
