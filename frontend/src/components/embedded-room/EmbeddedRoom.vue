<template>
  <iframe
    width="100%"
    height="100%"
    :src="props.url"
    allow="camera;microphone;fullscreen;display-capture *;"
    allowfullscreen
  ></iframe>
</template>

<script setup lang="ts">
const props = defineProps<{
  /**
   * The url of the BigBlueButton meeting room (CSP should allow only specific hosts)
   */
  url: string
}>()
</script>
