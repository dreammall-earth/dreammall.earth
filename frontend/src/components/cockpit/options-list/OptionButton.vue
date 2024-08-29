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
  width: calc(54px + var(--padding-left, 0px) + var(--padding-right, 0px));
  padding-right: var(--padding-right, initial);
  padding-left: var(--padding-left, initial);
  font-size: 10px;
  background: var(--v-cockpit-element-background);

  &:first-child {
    border-radius: 16px 0 0 16px;

    --padding-left: 4px;
  }

  &:last-child {
    border-radius: 0 16px 16px 0;

    --padding-right: 4px;
  }
}

.button {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
