<template>
  <TransitionGroup name="options">
    <ul v-if="props.showIf" class="options-list">
      <slot />
    </ul>
  </TransitionGroup>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

const props = defineProps<{
  showIf: boolean
}>()
</script>

<style scoped>
.options-list {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: calc(100% - 30px);
  background-color: var(--v-sidebar-background);
  display: flex;
  padding: 0;
  list-style: none;
}

.options-move, /* apply transition to moving elements */
.options-enter-active,
.options-leave-active {
  transition: all 0.3s ease;
}

.options-enter-from,
.options-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.options-leave-active {
  position: absolute;
}
</style>
