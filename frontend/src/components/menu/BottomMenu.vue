<template>
  <div class="bottom-menu w-100 position-fixed bottom-0 justify-space-around align-center py-2">
    <v-icon icon="mdi-account"></v-icon>
    <v-icon icon="mdi-bell"></v-icon>
    <v-icon icon="mdi-magnify"></v-icon>
    <UserInfo userName="Miro" />
  </div>
</template>

<script lang="ts" setup>
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
