<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  window.parent.postMessage('close', '*')
})
</script>
