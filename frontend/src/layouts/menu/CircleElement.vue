<template>
  <div
    class="circle rounded-circle border-sm text-font pa-2 d-flex justify-center align-center"
    :class="{ active: $props.isActive }"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  isActive?: boolean
}>()
</script>

<style scoped lang="scss">
.circle {
  width: var(--menu-icon-height);
  height: var(--menu-icon-height);
  background: var(--v-icon-background);
}

.active {
  color: white !important;
  background: linear-gradient(135deg, #f09630, #2ca5b1);
}
</style>
