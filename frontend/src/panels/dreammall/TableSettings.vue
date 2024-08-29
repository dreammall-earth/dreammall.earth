<!-- Mainly Duplicated code from TableSetup Panel -->
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
    :submit-text="steps[currentStep]?.submitText ?? 'Weiter'"
    @next="onNext"
    @submit="onSubmit"
    @custom="onCustom"
    @table-name:updated="updateTableName"
    @is-public:updated="updateIsPublic"
    @users:updated="updateUsers"
  />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

import GlobalErrorHandler from '#plugins/globalErrorHandler'
import MyTableSettings from '#src/panels/dreammall/interfaces/MyTableSettings'
import TableSettingsRoot from '#src/panels/dreammall/TableSettingsRoot.vue'
import TableSetupStepB from '#src/panels/dreammall/TableSetupStepB.vue'
import TableSetupStepC from '#src/panels/dreammall/TableSetupStepC.vue'
import PanelHeader from '#src/panels/PanelHeader.vue'
import { useTablesStore } from '#stores/tablesStore'
import { MyTable, useUserStore } from '#stores/userStore'

const tablesStore = useTablesStore()
const userStore = useUserStore()

const myTable: MyTable = userStore.getMyTable
const tableSettings = ref<MyTableSettings>({
  name: myTable?.name || '',
  isPublic: myTable.public || true,
  users: myTable.users.map((u) => u.id) || [],
})

const currentStep = ref(0)

const updateTableName = (name: string) => {
  tableSettings.value.name = name
}

const updateIsPublic = (isPublic: boolean) => {
  tableSettings.value.isPublic = isPublic
}

const updateUsers = (users: number[]) => {
  tableSettings.value.users = users
}

const onSubmitSettingsAsync = async (): Promise<string> => {
  try {
    await tablesStore.updateMyTable(tableSettings.value.name, tableSettings.value.isPublic)
    return 'root'
  } catch (error) {
    GlobalErrorHandler.error('Error occurred by updating the settings', error)
    return ''
  }
}

const onSubmitUsersAsync = async (): Promise<string> => {
  try {
    await tablesStore.updateMyTableUsers(tableSettings.value.users)
    return 'root'
  } catch (error) {
    GlobalErrorHandler.error('Error occurred by updating the users', error)
    return ''
  }
}

const onSubmitCloseCallAsync = async (): Promise<string> => {
  emit('close')
  return ''
}

type StepId = string | (() => string) | (() => Promise<string>)
type Step = {
  component: unknown
  id: string
  title: string
  submit: StepId
  submitText: string
  back: StepId
}
const steps: Step[] = [
  {
    component: TableSettingsRoot,
    id: 'root',
    title: 'Mein Tisch',
    submit: onSubmitCloseCallAsync,
    submitText: 'Beenden',
    back: 'previous',
  },
  {
    component: TableSetupStepB,
    id: 'settings',
    title: 'Einstellungen',
    submit: onSubmitSettingsAsync,
    submitText: 'Übernehmen',
    back: 'root',
  },
  {
    component: TableSetupStepC,
    id: 'users',
    title: 'Teilnehmer',
    submit: onSubmitUsersAsync,
    submitText: 'Übernehmen',
    back: 'root',
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

const transitToNextAsync = () => transitToIdAsync(steps[currentStep.value].submit)
const transitToPreviousAsync = () => transitToIdAsync(steps[currentStep.value].back)

const transitToIdAsync = async (destinationId: StepId) => {
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
    currentStep.value = await findStepByIdAsync(destinationId)
  } else if (typeof destinationId === 'function') {
    currentStep.value = await findStepByIdAsync(await destinationId())
  } else {
    currentStep.value = -1
  }

  if (currentStep.value >= 0) {
    updateHistory(currentStep.value)
  } else {
    emit('close')
  }
}

const findStepByIdAsync = async (id: string): Promise<number> => {
  if (!id) return currentStep.value
  return steps.findIndex((step) => step.id === id)
}

const onNext = transitToNextAsync
const onBack = transitToPreviousAsync
const onCustom = async (stepId: string) => transitToIdAsync(stepId)

const onClose = () => emit('close')
const onSubmit = onClose

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
