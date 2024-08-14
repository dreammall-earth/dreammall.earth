<template>
  <PanelHeader
    :title="steps[currentStep]?.title ?? 'unknown'"
    :is-back-button-visible="currentStep > 0"
    :is-close-button-visible="true"
    @back="onBack"
    @close="onClose"
  />
  <component :is="steps[currentStep].component" v-if="currentStep < steps.length" @next="onNext" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

import TableSetupStepA from '#src/panels/dreammall/TableSetupStepA.vue'
import TableSetupStepB from '#src/panels/dreammall/TableSetupStepB.vue'
import TableSetupStepC from '#src/panels/dreammall/TableSetupStepC.vue'
import TableSetupStepD from '#src/panels/dreammall/TableSetupStepD.vue'
import PanelHeader from '#src/panels/PanelHeader.vue'

const steps = [
  { component: TableSetupStepA, title: 'Mall Talk' },
  { component: TableSetupStepB, title: 'Tisch erstellen' },
  { component: TableSetupStepC, title: 'Leute einladen' },
  { component: TableSetupStepD, title: 'Kleine Erinnerung' },
]

const currentStep = ref(0)

const emit = defineEmits<{
  (e: 'close'): void
}>()

const updateHistory = (step: number) => {
  // if (window?.location?.href == null) return
  // const url = new URL(window.location.href)
  // url.searchParams.set('step', step.toString())

  // todo: find other solution. This causes conflicts with Vike
  // window.history.pushState({ step }, '', url.toString())
}

const onNext = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
    updateHistory(currentStep.value)
  } else {
    emit('close')
  }
}

const onBack = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    updateHistory(currentStep.value)
  } else {
    emit('close')
  }
}

const onClose = () => emit('close')

const reset = () => {
  currentStep.value = 0
  updateHistory(currentStep.value)
}
reset()

defineExpose({ reset })

const handlePopState = (event: PopStateEvent) => {
  if (event.state && typeof event.state.step === 'number') {
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
  updateHistory(currentStep.value)
})

onUnmounted(() => {
  window.removeEventListener('popstate', handlePopState)
})

// todo: add createTable
// todo: hasOwnTable -> getOwnTable

</script>

<style scoped lang="scss"></style>
