<template>
  <div class="news-indicator">
    <div class="icon-circle d-flex justify-center align-center">
      <v-icon icon="$bell"></v-icon>
    </div>
    <div class="marker d-flex justify-center align-center" :data-show-marker="props.hasNews"></div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  hasNews: boolean
}>()
</script>

<style scoped lang="scss">
.marker {
  border-radius: 12px;
  background: #d02f44;
  width: 22px;
  height: 22px;
  position: absolute;
  top: -8px;
  right: -8px;
  color: white;
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 0.1px;
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

.icon-circle {
  border-radius: 47.637px;
  border: 0.953px solid #d6dfe9;
  background: #fff;
  height: 42px;
  width: 42px;
}
</style>
