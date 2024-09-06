<template>
  <StepHeader
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
    v-model="tableSettings"
    :submit-text="steps[currentStep]?.submitText ?? 'Weiter'"
    @next="onNext"
    @submit="onSubmit"
  />
</template>

<script setup lang="ts">
import { navigate } from 'vike/client/router'
import { reactive } from 'vue'

import StepHeader from '#components/steps/StepHeader.vue'
import { Step, useSteps } from '#components/steps/useSteps'
import GlobalErrorHandler from '#plugins/globalErrorHandler'
import { useTablesStore } from '#stores/tablesStore'

import TableSetupStepA from './TableSetupStepA.vue'
import TableSetupStepB from './TableSetupStepB.vue'
import TableSetupStepC from './TableSetupStepC.vue'
import TableSetupStepD from './TableSetupStepD.vue'

import type MyTableSettings from '#components/malltalk/interfaces/MyTableSettings'

const tablesStore = useTablesStore()

const tableSettings = reactive<MyTableSettings>({
  name: tablesStore.defaultMyTableName || '',
  isPrivate: true,
  users: [],
})

const steps: Step[] = [
  {
    component: TableSetupStepA,
    id: 'start',
    title: 'Mall Talk',
    submit: 'next',
    submitText: 'Weiter',
    back: 'previous',
  },
  {
    component: TableSetupStepB,
    id: 'settings',
    title: 'Tisch erstellen',
    submit: () => (tableSettings.isPrivate ? 'users' : 'end'),
    submitText: 'Weiter',
    back: 'previous',
  },
  {
    component: TableSetupStepC,
    id: 'users',
    title: 'Leute einladen',
    submit: 'next',
    submitText: 'Weiter',
    back: 'previous',
  },
  {
    component: TableSetupStepD,
    id: 'end',
    title: 'Kleine Erinnerung',
    submit: 'next',
    submitText: "Los geht's",
    back: () => (tableSettings.isPrivate ? 'users' : 'settings'),
  },
]

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { currentStep, onNext, onBack, reset } = useSteps(steps, emit)

const onSubmit = async () => {
  try {
    const table = await tablesStore.createMyTable(
      tableSettings.name,
      !tableSettings.isPrivate,
      tableSettings.users,
    )

    if (!table) {
      GlobalErrorHandler.error('Could not create MyTable')
      return
    }

    emit('close')

    const tableId = await tablesStore.joinMyTable()
    if (!tableId) {
      GlobalErrorHandler.error('Could not join myTable')
      return
    }

    await navigate(`/table/${tableId}`)
  } catch (error) {
    GlobalErrorHandler.error('Error opening table', error)
  }
}

const onClose = () => emit('close')

reset()
defineExpose({ reset })
</script>
#src/panels/dreammall-button-drawer/interfaces/MyTableSettings.js
