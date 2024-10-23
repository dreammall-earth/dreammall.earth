<template>
  <v-menu v-model="isOpen">
    <template #activator="{ props }">
      <button
        v-bind="props"
        :class="$attrs.class"
        class="user-info rounded-pill d-flex flex-row text-font border-sm align-center justify-center"
      >
        <ClientOnly
          ><UserAvatar
            :name="userStore.getCurrentUserName"
            :avatar-src="userStore.getCurrentUserAvatar" />
          <div class="d-flex flex-column justify-center text-right pa-1 pl-3 w-100">
            <v-icon
              icon="$ellipsis"
              data-test="user-dropdown"
              class="ellipsis-icon"
              :class="isOpen && 'rotated'"
            ></v-icon></div
        ></ClientOnly>
      </button>
    </template>
    <UserDropdown />
  </v-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import UserAvatar from '#components/Avatar/UserAvatar.vue'
import ClientOnly from '#components/ClientOnly.vue'
import { useUserStore } from '#stores/userStore'

import UserDropdown from './UserDropdown.vue'

const userStore = useUserStore()

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

.ellipsis-icon {
  transition: transform 0.3s;
}

.rotated {
  transform: rotate(90deg);
}
</style>
