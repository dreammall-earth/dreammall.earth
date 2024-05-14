<template>
  <div class="message-indicator">
    <Circle>
      <v-icon icon="$message" color="secondary"></v-icon>
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
import Circle from '#components/circle/Circle.vue'
const props = defineProps<{
  numberOfMessages: number
}>()
</script>

<style scoped lang="scss">
.count {
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

  &[data-show-count='false'] {
    opacity: 0;
  }
}

.message-indicator {
  position: relative;
  width: fit-content;
}
</style>
