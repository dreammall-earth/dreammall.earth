import { ref, VNode } from 'vue'

const currentComponent = ref<VNode | null>(null)

export default function usePanel() {
  const setComponent = (component: VNode) => {
    currentComponent.value = component
  }

  const close = () => {
    currentComponent.value = null
  }

  return {
    currentComponent,
    setComponent,
    close,
  }
}
