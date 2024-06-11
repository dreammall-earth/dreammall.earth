<template>
  <DefaultLayout>
    <div class="container">
      <MyRoom />
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import MyRoom from '#components/embedded-room/MyRoom.vue'
import DefaultLayout from '#layouts/DefaultLayout.vue'
</script>

<style scoped>
.container {
  width: 100%;
  height: 80vh;
}
</style>
