<template>
  <div class="cockpit-card">
    <div class="header">
      <slot name="header"></slot>
    </div>
    <hr />
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.cockpit-card {
  --padding: 20px;

  padding: var(--padding);
  background-color: var(--v-sidebar-background);
  border-radius: 20px;
}

hr {
  margin-block: 15px;
  margin-inline: calc(-1 * var(--padding));
  border-color: rgb(var(--v-theme-background));
  border-style: solid;
  border-width: 0.5px;
}
</style>
