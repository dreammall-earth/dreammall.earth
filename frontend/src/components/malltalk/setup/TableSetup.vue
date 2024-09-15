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
import { storeToRefs } from 'pinia'
import { reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import StepControl from '#components/steps/StepControl.vue'
import { Step } from '#components/steps/useSteps'
import GlobalErrorHandler from '#plugins/globalErrorHandler'
import { useTablesStore } from '#stores/tablesStore'

import EnterNameAndVisibility from './EnterNameAndVisibility.vue'
import SelectUsers from './SelectUsers.vue'
import StartSetup from './StartSetup.vue'
import SubmitTable from './SubmitTable.vue'

import type MyTableSettings from '#components/malltalk/interfaces/MyTableSettings'
import type { ComponentExposed } from 'vue-component-type-helpers'

const tablesStore = useTablesStore()
const { defaultMyTableName } = storeToRefs(tablesStore)

const tableSettings = reactive<MyTableSettings>({
  name: defaultMyTableName.value,
  isPrivate: false,
  users: [],
  tableId: 0,
})

const { t } = useI18n()

watch(defaultMyTableName, (value) => {
  if (value && !tableSettings.name) {
    tableSettings.name = value
  }
})

const steps: Step[] = [
  {
    component: StartSetup,
    id: 'start',
    title: 'Mall Talk',
    submit: 'next',
    submitText: t('dream-mall-panel.setup.continue'),
    back: 'previous',
  },
  {
    component: EnterNameAndVisibility,
    id: 'settings',
    title: t('dream-mall-panel.setup.table-creation-title'),
    submit: () => (tableSettings.isPrivate ? 'users' : 'end'),
    submitText: t('dream-mall-panel.setup.continue'),
    back: 'previous',
  },
  {
    component: SelectUsers,
    id: 'users',
    title: t('dream-mall-panel.setup.invitation-title'),
    submit: 'next',
    submitText: t('dream-mall-panel.setup.continue'),
    back: 'previous',
  },
  {
    component: SubmitTable,
    id: 'end',
    title: t('dream-mall-panel.setup.submit-title'),
    submit: 'next',
    submitText: t('dream-mall-panel.setup.create-table'),
    back: () => (tableSettings.isPrivate ? 'users' : 'settings'),
    canBack: false,
  },
]

defineEmits<{
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

    tableSettings.tableId = await tablesStore.joinMyTable()
    if (!tableSettings.tableId) {
      GlobalErrorHandler.error('Could not join myTable')
    }
  } catch (error) {
    GlobalErrorHandler.error(t('error.globalerror.text'), error)
  }

  stepControl.value?.next()
}

const stepControl = ref<ComponentExposed<typeof StepControl<MyTableSettings>> | null>(null)

defineExpose({ reset: () => stepControl.value?.reset() })
</script>