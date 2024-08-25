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
  background: rgba(93, 102, 112, 0.55);
  font-size: 10px;

  &:first-child {
    border-radius: 16px 0px 0px 16px;
  }

  &:last-child {
    border-radius: 0px 16px 16px 0px;
  }
}

.button {
  display: flex;
  flex-flow: column;
  height: 100%;
  justify-content: center;
  align-items: center;
  color: #f5f5f5;
  width: 100%;
}
</style>
