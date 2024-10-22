<template>
  <div class="dream-mall-floating-container" :class="{ active: $props.isVisible }">
    <div class="dream-mall-button-wrapper">
      <div class="dream-mall-button">
        <DreamMallButton
          :is-active="$props.isVisible"
          :is-notification="isIncomingInvitation"
          @click="$emit('toggle')"
        />
      </div>
    </div>
    <div class="dream-mall-panel">
      <InvitationSteps
        v-if="isIncomingInvitation"
        ref="invitationStepsRef"
        @close="closeInvitation"
      />
      <component :is="currentComponent" v-else ref="currentRef" @close="$emit('toggle')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, watch, computed, nextTick } from 'vue'

import DreamMallButton from '#components/buttons/DreamMallButton.vue'
import InvitationSteps from '#components/malltalk/invitation/InvitationSteps.vue'
import TableSettings from '#components/malltalk/settings/TableSettings.vue'
import TableSetup from '#components/malltalk/setup/TableSetup.vue'
import { Call, useTablesStore } from '#stores/tablesStore'

import useDreamMallPanel from './useDreamMallPanel'

type PanelComponent =
  | InstanceType<typeof TableSetup>
  | InstanceType<typeof TableSettings>
  | InstanceType<typeof InvitationSteps>

const props = defineProps<{
  isVisible: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle'): void
  (e: 'open'): void
}>()

// Invitations are handled separately so we can easily go back to the previous state when the invitation is closed
const currentRef = ref<PanelComponent | null>(null)
const isIncomingInvitation = ref<boolean>(false)
const invitationStepsRef = ref<InstanceType<typeof InvitationSteps> | null>(null)

const { getMode } = useDreamMallPanel()

const currentComponent = computed(() => {
  switch (getMode.value) {
    case 'mall-talk-setup':
      return TableSetup
    case 'table-settings':
      return TableSettings
    case 'incoming-invitation':
      return InvitationSteps
    default:
      return null
  }
})

const resetDreamMallPanel = () => {
  currentRef.value?.reset()
  invitationStepsRef.value?.reset()
}

// Reset panel content before opening the panel
watch(
  () => props.isVisible,
  (isVisible) => {
    if (isVisible) {
      resetDreamMallPanel()
    }
  },
)

const tablesStore = useTablesStore()
const { getCurrentCall } = storeToRefs(tablesStore)

watch(getCurrentCall, (call: Call | null) => {
  resetDreamMallPanel() // Is this what we want? Would it be desirable to keep the state of the panel and restore it after accepting or declining the invitation?
  if (call && call.user?.id && call?.table) {
    isIncomingInvitation.value = true
    nextTick(() => {
      invitationStepsRef.value?.setInvitation(
        call.user.id,
        call.user.name,
        call.table.id,
        call.table.meetingName,
      )

      emit('open')
    })
  } else {
    isIncomingInvitation.value = false
  }
})

const closeInvitation = () => {
  isIncomingInvitation.value = false
  emit('toggle')
}
</script>

<style scoped lang="scss">
@use 'sass:map';
@import 'vuetify/lib/styles/settings/_variables';

.dream-mall-floating-container {
  --width: 400px;
  --button-size: 100px;
  --button-scaling: 0.7;
  --panel-height: 500px;
  --animation-duration: 0.3s;
  --animation-timing: ease-out;

  position: fixed;
  bottom: 10px;
  left: calc(50% - var(--width) / 2);
  z-index: 5000;
  display: flex;
  flex-flow: column nowrap;
  place-content: center flex-start;
  align-items: center;
  width: var(--width);
  height: var(--button-size);
  pointer-events: none;
  transition: height var(--animation-duration) var(--animation-timing);

  .dream-mall-button-wrapper {
    z-index: 5001;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--button-size);
    height: var(--button-size);
    transition: transform var(--animation-duration) var(--animation-timing);
  }

  .dream-mall-button {
    width: 100%;
    height: 100%;
    pointer-events: none;
    transition:
      transform var(--animation-duration) var(--animation-timing),
      width var(--animation-duration) var(--animation-timing),
      height var(--animation-duration) var(--animation-timing);
  }

  &.active {
    height: calc(var(--panel-height) + var(--button-size));

    .dream-mall-button-wrapper {
      transform: translateY(calc(var(--button-size) / 2));
    }

    .dream-mall-button {
      width: calc(var(--button-size) * var(--button-scaling));
      height: calc(var(--button-size) * var(--button-scaling));
      transform: scale(var(--button-scaling));
    }
  }

  .dream-mall-panel {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    flex-flow: column nowrap;
    place-content: center flex-start;
    align-items: center;
    width: 100%;
    height: calc(var(--button-size) / 2);
    padding-top: 10px;
    padding-bottom: 20px;
    overflow: hidden;
    pointer-events: none;
    background-color: var(--v-dm-panel-background-color);
    backdrop-filter: blur(30px);
    border: 1px solid var(--v-dm-panel-border-color);
    border-radius: 30px;
    opacity: 0;
    transition:
      height var(--animation-duration) var(--animation-timing),
      opacity var(--animation-duration) var(--animation-timing);
  }

  &.active .dream-mall-panel {
    height: var(--panel-height);
    pointer-events: all;
    opacity: 1;
  }

  @media #{map.get($display-breakpoints, 'sm-and-down')} {
    --width: 100vw;
    --panel-height: 75vh;

    bottom: 0;
    left: 0;

    &.active {
      height: calc(var(--panel-height) + var(--button-size));
    }

    .dream-mall-panel {
      border-radius: 30px 30px 0 0;
    }

    .dream-mall-button {
      transform: translateY(-10px);
    }

    &.active .dream-mall-panel {
      height: var(--panel-height);
    }
  }
}
</style>
