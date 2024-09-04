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
    v-model="tableSettings"
    :submit-text="steps[currentStep]?.submitText ?? 'Weiter'"
    @next="onNext"
    @submit="onSubmit"
  />
</template>

<script setup lang="ts">
import { navigate } from 'vike/client/router'
import { reactive } from 'vue'

import GlobalErrorHandler from '#plugins/globalErrorHandler'
import { Step, useSteps } from '#src/panels/composables/useSteps'
import MyTableSettings from '#src/panels/dreammall/interfaces/MyTableSettings'
import TableSetupStepA from '#src/panels/dreammall/TableSetupStepA.vue'
import TableSetupStepB from '#src/panels/dreammall/TableSetupStepB.vue'
import TableSetupStepC from '#src/panels/dreammall/TableSetupStepC.vue'
import TableSetupStepD from '#src/panels/dreammall/TableSetupStepD.vue'
import PanelHeader from '#src/panels/PanelHeader.vue'
import { useTablesStore } from '#stores/tablesStore'

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
./composables/useSteps ../composables/useSteps
