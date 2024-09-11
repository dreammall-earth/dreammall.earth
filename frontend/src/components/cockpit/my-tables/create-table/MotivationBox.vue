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
  width: 380px;
  height: 103px;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 8px;
  flex-shrink: 0;
  text-align: center;
  font-size: 14px;
  line-height: 110%; /* 15.4px */
  border-radius: 20px;
  margin-bottom: 16px;
  background: var(--v-panel-element-background);
}

.logo {
  width: 40px;
}
</style>
