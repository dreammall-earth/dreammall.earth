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
  height: 80vh;
  width: 100%;
}
</style>
