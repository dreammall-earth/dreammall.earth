<template>
  <PanelHeader
    v-if="steps"
    :title="steps[currentStep]?.title ?? 'unknown'"
    :is-back-button-visible="currentStep > 0"
    :is-close-button-visible="true"
    @back="onBack"
    @close="onClose"
  />
  <component
    :is="steps[currentStep].component"
    v-if="steps && currentStep < steps.length"
    :my-table-settings="tableSettings"
    @next="onNext"
    @table-name:updated="updateTableName"
    @is-public:updated="updateIsPublic"
    @users:updated="updateUsers"
  />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

import MyTableSettings from '#src/panels/dreammall/interfaces/MyTableSettings'
import TableSetupStepA from '#src/panels/dreammall/TableSetupStepA.vue'
import TableSetupStepB from '#src/panels/dreammall/TableSetupStepB.vue'
import TableSetupStepC from '#src/panels/dreammall/TableSetupStepC.vue'
import TableSetupStepD from '#src/panels/dreammall/TableSetupStepD.vue'
import PanelHeader from '#src/panels/PanelHeader.vue'
import { useTablesStore } from '#stores/tablesStore'

const tablesStore = useTablesStore()

const currentStep = ref(0)

const tableSettings = ref<MyTableSettings>({
  name: tablesStore.defaultMyTableName || '',
  isPublic: false,
  users: [],
})

const updateTableName = (name: string) => {
  tableSettings.value.name = name
}

const updateIsPublic = (isPublic: boolean) => {
  tableSettings.value.isPublic = isPublic
}

const updateUsers = (users: number[]) => {
  tableSettings.value.users = users
}

type StepId = string | (() => string)
type Step = {
  component: unknown
  id: string
  title: string
  submit: StepId
  back: StepId
}
const steps: Step[] = [
  { component: TableSetupStepA, id: 'start', title: 'Mall Talk', submit: 'next', back: 'previous' },
  {
    component: TableSetupStepB,
    id: 'settings',
    title: 'Tisch erstellen',
    submit: () => (tableSettings.value.isPublic ? 'end' : 'users'),
    back: 'previous',
  },
  {
    component: TableSetupStepC,
    id: 'users',
    title: 'Leute einladen',
    submit: 'next',
    back: 'previous',
  },
  {
    component: TableSetupStepD,
    id: 'end',
    title: 'Kleine Erinnerung',
    submit: 'next',
    back: () => (tableSettings.value.isPublic ? 'settings' : 'users'),
  },
]

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
  } else if (typeof destinationId === 'string') {
    currentStep.value = findStepById(destinationId)
  } else if (typeof destinationId === 'function') {
    currentStep.value = findStepById(destinationId())
  } else {
    currentStep.value = -1
  }

  if (currentStep.value >= 0) {
    updateHistory(currentStep.value)
  } else {
    emit('close')
  }
}

const findStepById = (id: string): number => steps.findIndex((step) => step.id === id)

const onNext = transitToNext
const onBack = transitToPrevious

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
