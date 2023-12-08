<template>
  <video
    ref="video"
    class="video w-100"
    :poster="VideoPoster"
    controls
    autoplay
    muted
    preload="auto"
    playsinline
    @ended="videoEnded"
  >
    <source :src="videoSource" :type="videoType" />
  </video>
</template>

<script lang="ts" setup>
import VideoPoster from '#assets/img/video_placeholder.png'

const props = withDefaults(
  defineProps<{
    /**
     * The source of the video
     */
    videoSource: string
    /**
     * the type of the video
     */
    videoType?: string
    /**
     * size of the button
     */
  }>(),
  { type: 'video/mp4' },
)

const emit = defineEmits<{
  (e: 'ended', id: number): void
}>()

function videoEnded() {
  emit('ended', 1)
}
</script>
