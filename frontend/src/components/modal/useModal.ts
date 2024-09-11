import { Component, markRaw, ref, computed } from 'vue'

const currentComponent = ref<Component | null>(null)

export default function useModal() {
  const setComponent = (component: Component) => {
    currentComponent.value = markRaw(component)
  }

  const close = () => {
    currentComponent.value = null
  }

  const isModalActive = computed(() => currentComponent.value !== null)

  return {
    currentComponent,
    setComponent,
    close,
    isModalActive,
  }
}
