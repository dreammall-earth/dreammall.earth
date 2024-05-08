<template>
  <div class="bottom-menu w-100 position-fixed bottom-0 justify-space-around align-center py-2">
    <MessageIndicator :number-of-messages="3" />
    <NewsIndicator :has-news="true" />
    <v-icon icon="mdi-magnify"></v-icon>
    <UserInfo user-name="Miro" />
  </div>
</template>

<script lang="ts" setup>
import MessageIndicator from '#components/messageIndicator/MessageIndicator.vue'
import NewsIndicator from '#components/newsIndicator/NewsIndicator.vue'

import UserInfo from './UserInfo.vue'
</script>

<style scoped lang="scss">
.bottom-menu {
  bottom: 0;
  border-radius: 30px 30px 0px 0px;
  background: rgba(78, 91, 107, 0.6);
  backdrop-filter: blur(20px);
}
</style>
