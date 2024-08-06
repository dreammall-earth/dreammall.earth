<template>
  <iframe
    v-if="props.url"
    width="100%"
    height="100%"
    :src="props.url"
    allow="camera;microphone;fullscreen;display-capture *;"
  ></iframe>
</template>

<script setup lang="ts">
const props = defineProps<{
  /**
   * The url of the BigBlueButton meeting table (CSP should allow only specific hosts)
   */
  url: string | null
}>()
</script>
