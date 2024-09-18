<template>
  <div class="circle rounded-circle border-sm text-icon pa-2 d-flex justify-center align-center">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.circle {
  width: var(--menu-icon-height);
  height: var(--menu-icon-height);
  background: var(--v-icon-background) !important;
}
</style>
