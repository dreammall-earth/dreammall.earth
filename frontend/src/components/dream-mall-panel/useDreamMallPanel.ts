import { ref, computed } from 'vue'

type Mode = 'mall-talk-setup' | 'table-settings'

const currentMode = ref<Mode | null>('mall-talk-setup')

export default function useDreamMallPanel() {
  const getMode = computed(() => currentMode.value)

  const setMode = (mode: Mode) => {
    currentMode.value = mode
  }

  return {
    getMode,
    setMode,
  }
}
