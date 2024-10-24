<template>
  <v-avatar class="avatar d-flex align-center text-font border-sm" :size="size">
    <v-img v-if="avatarSrc" :src="avatarSrc" :alt="name" cover />
    <span v-else>{{ initials }}</span>
  </v-avatar>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { getInitials } from '#src/utils/getInitials'

const props = withDefaults(
  defineProps<{
    name: string | undefined
    avatarSrc: string | undefined
    size: number
  }>(),
  { size: 44 },
)

const initials = computed(() => {
  return getInitials(props.name ?? '').toUpperCase()
})
</script>

<style scoped lang="scss">
.avatar {
  width: calc(var(--menu-icon-height) - 6px) !important;
  height: calc(var(--menu-icon-height) - 6px) !important;
  margin: 3px !important;
  background-color: rgb(var(--v-theme-cockpit-highlight));
  border-color: rgb(var(--v-theme-border) 0.8);
}
</style>
