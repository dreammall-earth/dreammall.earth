<template>
  <StepControl
    ref="stepControl"
    v-model="tableSettings"
    :is-dream-mall-button-mode="true"
    :steps="steps"
    @close="$emit('close')"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { reactive, watch, ref, computed } from 'vue'

import StepControl from '#components/steps/StepControl.vue'
import { Step } from '#components/steps/useSteps'
import { usePageContext } from '#context/usePageContext'
import { useTablesStore } from '#stores/tablesStore'
import { useUserStore } from '#stores/userStore'

import ChangeUsers from './ChangeUsers.vue'
import TableSettingsRoot from './TableSettingsRoot.vue'

import type MyTableSettings from '#components/malltalk/interfaces/MyTableSettings'
import type { ComponentExposed } from 'vue-component-type-helpers'

const userStore = useUserStore()

const { getMyTable: myTable } = storeToRefs(userStore)

const tableSettings = reactive<MyTableSettings>({
  name: myTable.value?.name || '',
  isPrivate: !myTable.value?.public || false,
  users: myTable.value?.users.map((u) => u.id) || [],
  meetingID: myTable.value?.meetingID || '',
})

const pageContext = usePageContext()
const tablesStore = useTablesStore()

const tableId = computed(() => {
  return pageContext.routeParams?.id ? pageContext.routeParams.id : ''
})

watch(tablesStore.getTables, () => {
  meetingName.value = tablesStore.getTable(tableId.value)?.meetingName || 'Mein Tisch'
})

const meetingName = ref<string>('Mein Tisch')

watch(myTable, (value) => {
  tableSettings.name = value?.name || ''
  tableSettings.isPrivate = !value?.public || false
  tableSettings.users = value?.users.map((u) => u.id) || []
  tableSettings.meetingID = value?.meetingID || ''
})

const steps: Step[] = [
  {
    component: TableSettingsRoot,
    id: 'root',
    title: meetingName,
    submit: 'close',
    submitText: 'Beenden',
    back: 'previous',
  },
  {
    component: ChangeUsers,
    id: 'users',
    title: ref('Teilnehmer'),
    submit: 'root',
    submitText: 'Übernehmen',
    back: 'root',
  },
]

defineEmits<{
  (e: 'close'): void
}>()

const stepControl = ref<ComponentExposed<typeof StepControl<MyTableSettings>> | null>(null)

defineExpose({ reset: () => stepControl.value?.reset() })
</script>
