<template>
  <div class="message-indicator">
    <div class="icon-circle d-flex justify-center align-center">
      <v-icon icon="$message"></v-icon>
    </div>
    <div class="count d-flex justify-center align-center">{{ props.numberOfMessages }}</div>
  </div>
</template>

<script lang="ts" setup>
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
}

.message-indicator {
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
