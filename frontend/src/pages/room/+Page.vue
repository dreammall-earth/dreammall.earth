<template>
  <DefaultLayout>
    <div class="container">
      <EmbeddedRoom :url="roomUrl" />
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import EmbeddedRoom from '#components/embedded-room/EmbeddedRoom.vue'
import useMyRoom from '#components/embedded-room/useMyRoom'
import DefaultLayout from '#layouts/DefaultLayout.vue'

const { roomUrl } = useMyRoom()
</script>

<style scoped>
.container {
  width: 100%;
  height: 80vh;
}
</style>
