<template>
  <div class="news-indicator">
    <Circle>
      <v-icon icon="$bell"></v-icon>
    </Circle>
    <div
      class="marker d-flex justify-center align-center rounded-circle"
      :data-show-marker="props.hasNews"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import Circle from './CircleElement.vue'

const props = defineProps<{
  hasNews: boolean
}>()
</script>

<style scoped lang="scss">
.marker {
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background: #d02f44;
  opacity: 1;
  transition: opacity 0.3s;

  &[data-show-marker='false'] {
    opacity: 0;
  }
}

.news-indicator {
  position: relative;
  width: fit-content;
}
</style>
