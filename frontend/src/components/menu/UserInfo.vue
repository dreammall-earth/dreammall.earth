<template>
  <v-menu v-model="isOpen">
    <template #activator="{ props }">
      <button
        v-bind="props"
        :class="$attrs.class"
        class="user-info rounded-pill d-flex flex-row text-icon border-sm align-center justify-center"
      >
        <ClientOnly>
          <v-avatar class="avatar d-flex align-center text-font border-sm bg-primary" size="44">
            <v-img v-if="userImage" :src="userImage" />
            <span v-else>{{ initals?.toUpperCase() }}</span>
          </v-avatar>
        </ClientOnly>
        <div class="d-flex flex-column justify-center text-right pa-1 pl-3 w-100">
          <v-icon
            icon="$ellipsis"
            data-test="user-dropdown"
            class="ellipsis-icon"
            :class="isOpen && 'rotated'"
          ></v-icon>
        </div>
      </button>
    </template>
    <UserDropdown />
  </v-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import ClientOnly from '#components/ClientOnly.vue'
import { useAuthStore } from '#stores/authStore'

import UserDropdown from './UserDropdown.vue'

const authStore = useAuthStore()

const name = authStore.user?.profile.name
const initals = name
  ?.split(' ')
  .map((n) => n.charAt(0))
  .join('')
const userImage = authStore.user?.profile.picture

const isOpen = ref(false)
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
  width: calc(var(--menu-icon-height) - 6px) !important;
  height: calc(var(--menu-icon-height) - 6px) !important;
  margin: 3px !important;
  border-color: rgb(var(--v-theme-border) 0.8);
}

.ellipsis-icon {
  transition: transform 0.3s;
}

.rotated {
  transform: rotate(90deg);
}
</style>
