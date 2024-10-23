<template>
  <StepControl
    ref="stepControl"
    v-model="invitation"
    :is-dream-mall-button-mode="true"
    :steps="steps"
    @submit="onAccept"
    @close="() => emit('close')"
  />
</template>

<script setup lang="ts">
import { navigate } from 'vike/client/router'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import Invitation from '#components/malltalk/interfaces/Invitation'
import IncomingInvitation from '#components/malltalk/invitation/IncomingInvitation.vue'
import TableSwap from '#components/malltalk/invitation/TableSwap.vue'
import StepControl from '#components/steps/StepControl.vue'
import { Step } from '#components/steps/useSteps'
import { usePageContext } from '#context/usePageContext'
import { useTablesStore } from '#stores/tablesStore'

import type { ComponentExposed } from 'vue-component-type-helpers'

const resetInvitation = () => {
  invitation.userId = 0
  invitation.userName = ''
  invitation.userAvatar = ''
  invitation.tableId = 0
  invitation.tableName = ''
}

const setInvitation = (userId: number, userName: string, tableId: number, tableName: string) => {
  invitation.userId = userId
  invitation.userName = userName
  invitation.userAvatar = ''
  invitation.tableId = tableId
  invitation.tableName = tableName
}

const invitation = reactive<Invitation>({
  userId: 0,
  userName: '',
  userAvatar: '',
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
    id: 'swap',
    title: t('dream-mall-panel.incoming-invitation.title'),
    submit: 'next',
    back: 'previous',
  },
]

const emit = defineEmits<{
  (e: 'close'): void
}>()

const pageContext = usePageContext()
const tablesStore = useTablesStore()

const onAccept = async () => {
  const isAlreadyInMeeting = pageContext.urlPathname === 'table'
  if (isAlreadyInMeeting && stepControl.value?.getCurrentId() !== 'swap') {
    stepControl.value?.goTo('swap')
  } else {
    if (!invitation.tableId) return
    try {
      await navigate(tablesStore.getTableUri(invitation.tableId))
    } catch (cause) {
      throw new Error(t('table.error'), { cause })
    }
  }
}

const stepControl = ref<ComponentExposed<typeof StepControl<Invitation>> | null>(null)

defineExpose({
  reset: () => {
    resetInvitation()
    stepControl.value?.reset()
  },
  setInvitation,
})
</script>
