import { ref, computed } from 'vue'

type Mode = 'mall-talk-setup' | 'table-settings' | 'incoming-invite'

const currentMode = ref<Mode | null>(null)

export default function useDreamMallPanel() {
  const setMode = (mode: Mode) => {
    currentMode.value = mode
  }

  const close = () => {
    currentMode.value = null
  }

  const isPanelActive = computed(() => currentMode.value !== null)

  return {
    currentMode,
    setMode,
    close,
    isPanelActive,
  }
}
