<template>
  <div class="motivation">
    <img :src="Logo" class="logo" />
    <slot />
  </div>
</template>

<script setup lang="ts">
import Logo from '#assets/dreammall-logo-no-text.svg'
</script>

<style scoped>
.motivation {
  display: flex;
  flex-flow: column;
  flex-shrink: 0;
  gap: 8px;
  align-items: center;
  justify-content: center;
  width: 380px;
  height: 103px;
  padding: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  line-height: 110%; /* 15.4px */
  text-align: center;
  background: var(--v-panel-element-background);
  border-radius: 20px;
}

.logo {
  width: 40px;
}
</style>
