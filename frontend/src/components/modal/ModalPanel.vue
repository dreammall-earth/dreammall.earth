<template>
  <TransitionGroup name="modal">
    <div v-if="!!currentComponent" class="modal">
      <component :is="currentComponent" @close="close" />
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import useModal from './useModal'

const { currentComponent, close } = useModal()
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 4000;
  width: min(636px, 100vw);
  height: min(550px, 100vh);
  pointer-events: all;
  background: var(--v-panel-background);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  transform: translate(calc(50vw - 50%), calc(50vh - 50%));
}

.modal-move,
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-active {
  opacity: 1;
}
</style>
