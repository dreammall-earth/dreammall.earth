<template>
  <div
    class="rounded-pill d-flex flex-row text-font bg-white border-sm align-center justify-center"
  >
    <div class="d-flex flex-column justify-center text-right pa-1 pl-3 w-100">
      <div class="phrase">{{ $t('menu.userPhrase') }}</div>
      <div class="name">{{ authStore.user?.profile.nickname }}</div>
    </div>
    <v-avatar class="avatar d-flex align-center text-font border-sm bg-primary" size="48">
      <v-img v-if="userImage" :src="userImage" />
      <span v-else>{{ initals?.toUpperCase() }}</span>
    </v-avatar>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '#stores/authStore'

// Avoid problems when same svg is used several times by randomizing path and image ids
const id = Math.floor(Math.random() * 10e4)

const authStore = useAuthStore()

const nickname = authStore.user?.profile.nickname
const name = authStore.user?.profile.name
const initals = name
  ?.split(' ')
  .map((n) => n.charAt(0))
  .join('')
const userImage = authStore.user?.profile.picture
</script>

<style scoped lang="scss">
.name {
  font-size: 14px;
}
.phrase {
  font-size: 12px;
  text-wrap: nowrap;
}
.avatar {
  border-color: rgba(var(--v-theme-border), 0.8);
}
</style>
m
