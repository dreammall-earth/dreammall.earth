<template>
  <div
    class="bottom-menu w-100 position-fixed bottom-0 justify-space-around align-center py-2 bg-surface"
  >
    <MessageIndicator :number-of-messages="3" />
    <NewsIndicator :has-news="true" />
    <Circle>
      <v-icon icon="$camera"></v-icon>
    </Circle>
    <UserInfo />
  </div>
</template>

<script lang="ts" setup>
import Circle from './CircleElement.vue'
import MessageIndicator from './MessageIndicator.vue'
import NewsIndicator from './NewsIndicator.vue'
import UserInfo from './UserInfo.vue'
</script>

<style scoped lang="scss">
.bottom-menu {
  bottom: 0;
  background: var(--v-bottom-menu-background) !important;
  backdrop-filter: blur(20px);
  border-radius: 30px 30px 0 0;
}
</style>
