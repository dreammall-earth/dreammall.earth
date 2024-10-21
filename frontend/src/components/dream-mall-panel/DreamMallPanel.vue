<template>
  <TransitionGroup name="modal"> </TransitionGroup>
</template>

<script setup lang="ts">
import InvitationSteps from '#components/malltalk/invitation/InvitationSteps.vue'
import TableSettings from '#components/malltalk/settings/TableSettings.vue'
import TableSetup from '#components/malltalk/setup/TableSetup.vue'

import useDreamMallPanel from './useDreamMallPanel'

export type ComponentRefs = {
  'mall-talk-setup': InstanceType<typeof TableSetup> | null
  'table-settings': InstanceType<typeof TableSettings> | null
  'incoming-invitation': InstanceType<typeof InvitationSteps> | null
}

export type PanelComponent =
  | InstanceType<typeof TableSetup>
  | InstanceType<typeof TableSettings>
  | InstanceType<typeof InvitationSteps>

export type TableSetupInstance = InstanceType<typeof TableSetup>
export type TableSettingsInstance = InstanceType<typeof TableSettings>
export type InvitationStepsInstance = InstanceType<typeof InvitationSteps>

const { close } = useDreamMallPanel()
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
