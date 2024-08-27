<template>
  <li class="item">
    <button class="button" @click="$emit('click')">
      <slot />
    </button>
  </li>
</template>

<script lang="ts" setup>
import { defineEmits } from 'vue'

defineEmits(['click'])
</script>

<style scoped>
.item {
  width: 54px;
  font-size: 10px;
  background: rgb(93 102 112 / 55%);

  &:first-child {
    border-radius: 16px 0 0 16px;
  }

  &:last-child {
    border-radius: 0 16px 16px 0;
  }
}

.button {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #f5f5f5;
}
</style>
