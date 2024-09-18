import { Component, markRaw, ref, computed } from 'vue'

const currentComponent = ref<Component | null>(null)

const currentProps = ref<object>({})

export default function useModal() {
  const setComponent = (component: Component, props: object = {}) => {
    currentComponent.value = markRaw(component)
    currentProps.value = props
  }

  const close = () => {
    currentComponent.value = null
  }

  const isModalActive = computed(() => currentComponent.value !== null)

  return {
    currentComponent,
    currentProps,
    setComponent,
    close,
    isModalActive,
  }
}
