<template>
  <iframe
    v-if="props.url"
    width="100%"
    height="100%"
    :src="props.url"
    allow="camera;microphone;fullscreen;display-capture;screen-wake-lock *;"
    class="table-iframe"
  ></iframe>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  /**
   * The url of the BigBlueButton meeting table (CSP should allow only specific hosts)
   */
  url: string | null
}>()

const emit = defineEmits<{
  (e: 'table-closed'): void
}>()

const postMessageListener = (event: MessageEvent) => {
  if (event.data === 'close') {
    emit('table-closed')
  }
}

onMounted(() => {
  window.addEventListener('message', postMessageListener)
})

onUnmounted(() => {
  window.removeEventListener('message', postMessageListener)
})
</script>

<style scoped lang="scss">
@use 'sass:map';
@import 'vuetify/lib/styles/settings/_variables';

.table-iframe {
  border: none;
  border-radius: 20px;
}

@media #{map.get($display-breakpoints, 'sm-and-down')} {
  .table-iframe {
    border-radius: 20px 20px 0 0;
  }
}
</style>
