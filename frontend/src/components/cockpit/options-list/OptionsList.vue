<template>
  <TransitionGroup name="options">
    <ul v-if="props.isVisible" class="options-list">
      <slot />
    </ul>
  </TransitionGroup>
</template>

<script lang="ts" setup>
const props = defineProps<{
  isVisible?: boolean
}>()
</script>

<style scoped>
.options-list {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: calc(100% - 30px);
  height: 100%;
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
