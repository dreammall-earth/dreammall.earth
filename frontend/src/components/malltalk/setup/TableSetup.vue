<template>
  <StepControl
    ref="stepControl"
    v-model="tableSettings"
    :steps="steps"
    @submit="onSubmit"
    @close="() => $emit('close')"
  />
</template>

<script setup lang="ts">
import { navigate } from 'vike/client/router'
import { reactive, ref } from 'vue'

import StepControl from '#components/steps/StepControl.vue'
import { Step } from '#components/steps/useSteps'
import GlobalErrorHandler from '#plugins/globalErrorHandler'
import { useTablesStore } from '#stores/tablesStore'

import TableSetupStepA from './TableSetupStepA.vue'
import TableSetupStepB from './TableSetupStepB.vue'
import TableSetupStepC from './TableSetupStepC.vue'
import TableSetupStepD from './TableSetupStepD.vue'

import type MyTableSettings from '#components/malltalk/interfaces/MyTableSettings'
import type { ComponentExposed } from 'vue-component-type-helpers'

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

const stepControl = ref<ComponentExposed<typeof StepControl<MyTableSettings>> | null>(null)

defineExpose({ reset: () => stepControl.value?.reset() })
</script>
