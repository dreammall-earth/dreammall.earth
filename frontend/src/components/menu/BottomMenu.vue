<template>
  <div
    class="bottom-menu d-flex w-100 position-fixed bottom-0 justify-space-around align-center py-2 bg-surface"
  >
    <Circle class="camera-button">
      <v-icon icon="$camera"></v-icon>
    </Circle>
    <CreateButtonMobile />
    <UserInfo />
  </div>
</template>

<script lang="ts" setup>
import CreateButtonMobile from '#components/buttons/CreateButtonMobile.vue'

import Circle from './CircleElement.vue'
import UserInfo from './UserInfo.vue'
</script>

<style scoped lang="scss">
.bottom-menu {
  bottom: 0;
  left: 0;
  z-index: 1;
  background: var(--v-bottom-menu-background) !important;
  backdrop-filter: blur(20px);
  border-radius: 30px 30px 0 0;

  .camera-button {
    transform: translateX(20px);
  }
}
</style>
