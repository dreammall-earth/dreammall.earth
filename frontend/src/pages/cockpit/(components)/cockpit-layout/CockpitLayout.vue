<template>
  <div class="cockpit px-8">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
@use '@style/breakpoints';

.cockpit {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  justify-content: center;
  margin: auto;
}

@include breakpoints.respond-to('md-and-up') {
  .cockpit {
    grid-template-columns: 400px 400px;
    max-width: 1200px;
    padding-bottom: 35px;
  }
}
</style>
