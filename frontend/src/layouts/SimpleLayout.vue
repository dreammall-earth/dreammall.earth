<template>
  <div class="background">
    <slot></slot>
  </div>
</template>

<style scoped>
.background {
  width: 100vw;
  height: 100vh;
  background-image: url('../assets/join-table-background.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
</style>
