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
import { useI18n } from 'vue-i18n'

import StepControl from '#components/steps/StepControl.vue'
import { Step } from '#components/steps/useSteps'
import { useTablesStore } from '#stores/tablesStore'

import EnterNameAndVisibility from './EnterNameAndVisibility.vue'
import SelectUsers from './SelectUsers.vue'
import TableCreated from './TableCreated.vue'

import type { ComponentExposed } from 'vue-component-type-helpers'

const { t } = useI18n()

export type CreateTableModel = {
  isPrivate: boolean
  name: string
  userIds: number[]
  tableId?: number
  meetingID?: string
}

const createTableModel = reactive<CreateTableModel>({
  meetingID: '',
  isPrivate: false,
  name: '',
  userIds: [],
})

const steps: Step[] = [
  {
    component: EnterNameAndVisibility,
    id: 'settings',
    title: ref(t('cockpit.myTables.createTable.create-title')),
    submit: 'users',
    submitText: t('cockpit.myTables.createTable.continue'),
    back: 'previous',
  },
  {
    component: SelectUsers,
    id: 'users',
    title: ref(t('cockpit.myTables.createTable.invitation-title')),
    submit: 'next',
    submitText: t('cockpit.myTables.createTable.continue'),
    back: 'previous',
  },
  {
    component: TableCreated,
    id: 'end',
    title: ref(t('cockpit.myTables.createTable.created-title')),
    submit: 'close',
    submitText: t('cockpit.myTables.createTable.created-submit'),
    back: () => 'users',
  },
]

const tablesStore = useTablesStore()

const onSubmit = async () => {
  const table = await tablesStore.createProjectTable(
    createTableModel.name,
    !createTableModel.isPrivate,
    createTableModel.userIds,
  )

  if (!table) {
    throw new Error('Could not create table')
  }

  createTableModel.tableId = table.id
  createTableModel.meetingID = table.meetingID

  stepControl.value?.next()
}

defineEmits<{
  (e: 'close'): void
}>()

const stepControl = ref<ComponentExposed<typeof StepControl<CreateTableModel>> | null>(null)

defineExpose({ reset: () => stepControl.value?.reset() })
</script>
