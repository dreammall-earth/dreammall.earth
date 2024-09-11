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
  pointer-events: all;
  position: fixed;
  top: 0;
  left: 0;
  transform: translate(calc(50vw - 50%), calc(50vh - 50%));
  border-radius: 20px;
  width: min(636px, 100vw);
  height: min(550px, 100vh);
  background: var(--v-panel-background);
  backdrop-filter: blur(15px);
  z-index: 4000;
}

.modal-move,
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-active {
  opacity: 1;
}
</style>
