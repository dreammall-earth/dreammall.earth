import { Component, onMounted, onUnmounted, ref } from 'vue'

type StepId = string | (() => string)
export type Step = {
  component: Component
  id: string
  title: string
  submit: StepId
  submitText?: string
  back: StepId
  canBack?: boolean
}

// const updateHistory = () => {
// if (window?.location?.href == null) return
// const url = new URL(window.location.href)
// url.searchParams.set('step', step.toString())
// todo: find other solution. This causes conflicts with Vike
// window.history.pushState({ step }, '', url.toString())
// }

export const useSteps = (steps: Step[], emit: (event: 'close') => void) => {
  const currentStep = ref(0)

  const transitToNext = () => transitToId(steps[currentStep.value].submit)
  const transitToPrevious = () => transitToId(steps[currentStep.value].back)

  const transitToId = (destinationId: StepId) => {
    if (destinationId === 'next') {
      if (currentStep.value < steps.length - 1) {
        currentStep.value++
      } else {
        currentStep.value = -1
      }
    } else if (destinationId === 'previous') {
      if (currentStep.value > 0) {
        currentStep.value--
      } else {
        currentStep.value = -1
      }
    } else if (destinationId === 'close') {
      currentStep.value = -1
    } else if (typeof destinationId === 'string') {
      currentStep.value = findStepById(destinationId)
    } else if (typeof destinationId === 'function') {
      currentStep.value = findStepById(destinationId())
    } else {
      currentStep.value = -1
    }

    if (currentStep.value >= 0) {
      // updateHistory(currentStep.value)
    } else {
      emit('close')
    }
  }

  const findStepById = (id: string): number => steps.findIndex((step) => step.id === id)

  const next = transitToNext
  const back = transitToPrevious

  const goTo = (stepId: string) => transitToId(stepId)

  const reset = () => {
    currentStep.value = 0
    // updateHistory(currentStep.value)
  }

  const handlePopState = (event: PopStateEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (event.state && typeof event.state.step === 'number') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      currentStep.value = event.state.step
    }
  }

  onMounted(() => {
    window.addEventListener('popstate', handlePopState)

    // Initialize the history state
    const urlParams = new URLSearchParams(window.location.search)
    const initialStep = parseInt(urlParams.get('step') || '0', 10)
    currentStep.value =
      isNaN(initialStep) || initialStep < 0 || initialStep >= steps.length ? 0 : initialStep
    // updateHistory(currentStep.value)
  })

  onUnmounted(() => {
    window.removeEventListener('popstate', handlePopState)
  })

  return {
    currentStep,
    next,
    back,
    goTo,
    reset,
  }
}
