<template>
  <div class="message-indicator">
    <Circle>
      <v-icon icon="$message"></v-icon>
    </Circle>
    <div
      class="count d-flex justify-center align-center"
      :data-show-count="props.numberOfMessages > 0"
    >
      {{ props.numberOfMessages }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import Circle from './CircleElement.vue'

const props = defineProps<{
  numberOfMessages: number
}>()
</script>

<style scoped lang="scss">
.count {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 22px;
  height: 22px;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  color: white;
  letter-spacing: 0.1px;
  background: #d02f44;
  border-radius: 12px;
  opacity: 1;
  transition: opacity 0.3s;

  &[data-show-count='false'] {
    opacity: 0;
  }
}

.message-indicator {
  position: relative;
  width: fit-content;
}
</style>
