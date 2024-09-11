<template>
  <StepControl
    ref="stepControl"
    v-model="createTableModel"
    :steps="steps"
    class="d-flex flex-column align-center pa-4 w-100"
    @submit="onSubmit"
    @close="() => $emit('close')"
  />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

import StepControl from '#components/steps/StepControl.vue'
import { Step } from '#components/steps/useSteps'
import GlobalErrorHandler from '#plugins/globalErrorHandler'
import { useTablesStore } from '#stores/tablesStore'

import EnterNameAndVisibility from './EnterNameAndVisibility.vue'
import SelectUsers from './SelectUsers.vue'
import TableCreated from './TableCreated.vue'

import type { ComponentExposed } from 'vue-component-type-helpers'

export type CreateTableModel = {
  isPrivate: boolean
  name: string
  userIds: number[]
  tableId?: number
}

const createTableModel = reactive<CreateTableModel>({
  isPrivate: false,
  name: '',
  userIds: [],
})

const steps: Step[] = [
  {
    component: EnterNameAndVisibility,
    id: 'settings',
    title: 'Tisch erstellen',
    submit: () => (createTableModel.isPrivate ? 'users' : 'end'),
    submitText: 'Weiter',
    back: 'previous',
  },
  {
    component: SelectUsers,
    id: 'users',
    title: 'Leute einladen',
    submit: 'next',
    submitText: 'Weiter',
    back: 'previous',
  },
  {
    component: TableCreated,
    id: 'end',
    title: 'Kleine Erinnerung',
    submit: 'close',
    submitText: "Los geht's",
    back: () => (createTableModel.isPrivate ? 'users' : 'settings'),
  },
]

const tablesStore = useTablesStore()

const onSubmit = async () => {
  const table = await tablesStore.createTable(
    createTableModel.name,
    !createTableModel.isPrivate,
    createTableModel.userIds,
  )

  if (!table) {
    GlobalErrorHandler.error('Could not create table')
    return
  }

  createTableModel.tableId = table.id

  stepControl.value?.next()
}

defineEmits<{
  (e: 'close'): void
}>()

const stepControl = ref<ComponentExposed<typeof StepControl<CreateTableModel>> | null>(null)

defineExpose({ reset: () => stepControl.value?.reset() })
</script>
