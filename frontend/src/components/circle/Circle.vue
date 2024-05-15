<template>
  <div
    class="circle rounded-circle border-sm text-icon bg-icon-background pa-2 d-flex justify-center align-center"
  >
    <slot />
  </div>
</template>

<style scoped lang="scss">
.circle {
  width: var(--menu-icon-height);
  height: var(--menu-icon-height);
}
</style>
