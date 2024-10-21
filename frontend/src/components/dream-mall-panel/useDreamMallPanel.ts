import { ref, computed } from 'vue'

import type {
  TableSettingsInstance,
  ComponentRefs,
  PanelComponent,
  TableSetupInstance,
  InvitationStepsInstance,
} from './DreamMallPanel.vue'

type Mode = 'mall-talk-setup' | 'table-settings' | 'incoming-invitation'

const currentMode = ref<Mode | null>(null)

const my = ref<ComponentRefs>()

const mallTalkSetupRef = ref<TableSetupInstance>()

const tableSettingsRef = ref<TableSettingsInstance>()

const incomingInvitationRef = ref<InvitationStepsInstance>()

export default function useDreamMallPanel() {
  // const currentComponent = computed(() => components[currentMode.value])

  const setMallTalkSetupRef...

  const setMode = (mode: Mode) => {
    currentMode.value = mode
  }

  const close = () => {
    currentMode.value = null
  }

  const isPanelActive = computed(() => currentMode.value !== null)

  const reset = () => {
    mallTalkSetupRef.value?.reset()
  }

  return {
    currentMode,
    setMode,
    setComponentRef,
    close,
    isPanelActive,
    reset,
  }
}
