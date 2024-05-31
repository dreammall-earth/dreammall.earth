<template>
  <v-menu>
    <template #activator="{ props }">
      <button
        v-bind="props"
        :class="$attrs.class"
        class="user-info rounded-pill d-flex flex-row text-icon border-sm align-center justify-center"
      >
        <v-avatar class="avatar d-flex align-center text-font border-sm bg-primary" size="44">
          <v-img v-if="userImage" :src="userImage" />
          <span v-else>{{ initals?.toUpperCase() }}</span>
        </v-avatar>
        <div class="d-flex flex-column justify-center text-right pa-1 pl-3 w-100">
          <v-icon icon="$ellipsis" data-test="user-dropdown"></v-icon>
        </div>
      </button>
    </template>
    <UserDropdown />
  </v-menu>
</template>

<script lang="ts" setup>
import { useAuthStore } from '#stores/authStore'

import UserDropdown from './UserDropdown.vue'

const authStore = useAuthStore()

const name = authStore.user?.profile.name
const initals = name
  ?.split(' ')
  .map((n) => n.charAt(0))
  .join('')
const userImage = authStore.user?.profile.picture
</script>

<style scoped lang="scss">
.user-info {
  height: var(--menu-icon-height);
  background: var(--v-icon-background);
}

.name {
  font-size: 14px;
}

.phrase {
  font-size: 12px;
  text-wrap: nowrap;
}

.avatar {
  border-color: rgb(var(--v-theme-border) 0.8);
}
</style>
m
