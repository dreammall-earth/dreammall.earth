<template>
  <StepControl
    ref="stepControl"
    v-model="invitation"
    :is-dream-mall-button-mode="true"
    :steps="steps"
    @submit="onAccept"
    @close="onDismiss"
  />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import Invitation from '#components/malltalk/interfaces/Invitation'
import IncomingInvitation from '#components/malltalk/invitation/IncomingInvitation.vue'
import TableSwap from '#components/malltalk/invitation/TableSwap.vue'
import StepControl from '#components/steps/StepControl.vue'
import { Step } from '#components/steps/useSteps'

import type MyTableSettings from '#components/malltalk/interfaces/MyTableSettings'
import type { ComponentExposed } from 'vue-component-type-helpers'

// todo: fetch information about table
// const tablesStore = useTablesStore()
// const { defaultMyTableName } = storeToRefs(tablesStore)

const resetInvitation = () => {
  invitation.userId = 0
  invitation.userName = ''
  invitation.tableId = 0
  invitation.tableName = ''
}

const invitation = reactive<Invitation>({
  userId: 0,
  userName: '',
  tableId: 0,
  tableName: '',
})
resetInvitation()

const { t } = useI18n()

const steps: Step[] = [
  {
    component: IncomingInvitation,
    id: 'start',
    title: t('dream-mall-panel.incoming-invitation.title'),
    submit: 'next',
    back: 'previous',
  },
  {
    component: TableSwap,
    id: 'settings',
    title: t('dream-mall-panel.incoming-invitation.title'),
    submit: 'next',
    back: 'previous',
  },
]

defineEmits<{
  (e: 'close'): void
}>()

const onAccept = async () => {}

const onDismiss = async () => {}

const stepControl = ref<ComponentExposed<typeof StepControl<MyTableSettings>> | null>(null)

defineExpose({
  reset: () => {
    resetInvitation()
    stepControl.value?.reset()
  },
})
</script>
