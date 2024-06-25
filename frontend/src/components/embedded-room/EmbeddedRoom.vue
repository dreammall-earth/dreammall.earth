<template>
  <iframe
    v-if="props.url && !isRedirected"
    width="100%"
    height="100%"
    :src="props.url"
    allow="camera;microphone;fullscreen;display-capture *;"
    @load="onRedirect"
  ></iframe>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  /**
   * The url of the BigBlueButton meeting room (CSP should allow only specific hosts)
   */
  url: string | null
}>()

const isRedirected = ref(false)

const emit = defineEmits(['closed'])

const onRedirect = (event: Event): void => {
  const src = (event.target as HTMLIFrameElement).src
  if (src === new URL(src).origin) {
    // We were redirected to the home page of our BigBlueButton server, hence we left the meeting
    isRedirected.value = true
    emit('closed')
  }
}
</script>
