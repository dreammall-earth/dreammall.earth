<template>
  <div v-if="!!currentComponent" class="panel">
    <button @click="close">Close</button>
    <component :is="currentComponent" />
  </div>
</template>

<script setup lang="ts">
import usePanel from './usePanel'

const { currentComponent, close } = usePanel()
</script>

<style scoped>
.panel {
  position: fixed;
  top: 0;
  left: 0;
  transform: translate(calc(50vw - 50%), calc(50vh - 50%));
  border-radius: 20px;
  width: 636px;
  height: 200px;
  background: var(--v-panel-background);
  backdrop-filter: blur(15px);
  z-index: 100;
}
</style>
