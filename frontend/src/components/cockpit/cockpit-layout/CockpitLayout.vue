<template>
  <div class="cockpit px-8">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
@use 'sass:map';
@import 'vuetify/lib/styles/settings/_variables';

.cockpit {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  justify-content: center;
  margin: auto;
}

@media #{map.get($display-breakpoints, 'md-and-up')} {
  .cockpit {
    grid-template-columns: 400px 400px;
    max-width: 1200px;
    padding-bottom: 35px;
  }
}
</style>
