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
import { navigate } from 'vike/client/router'
import { reactive, ref, watch } from 'vue'
import { ComponentExposed } from 'vue-component-type-helpers'
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

const { t } = useI18n()

const tablesStore = useTablesStore()
const { defaultMyTableName } = storeToRefs(tablesStore)

const tableSettings = reactive<MyTableSettings>({
  name: defaultMyTableName.value,
  isPrivate: false,
  users: [],
})

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
    submitText: 'Weiter',
    back: 'previous',
  },
  {
    component: EnterNameAndVisibility,
    id: 'settings',
    title: 'Tisch erstellen',
    submit: () => (tableSettings.isPrivate ? 'users' : 'end'),
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
    component: SubmitTable,
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
    GlobalErrorHandler.error(t('error.globalerror.text'), error)
  }
}

const stepControl = ref<ComponentExposed<typeof StepControl<MyTableSettings>> | null>(null)

defineExpose({ reset: () => stepControl.value?.reset() })
</script>
