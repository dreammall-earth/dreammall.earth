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

import type MyTableSettings from '#components/malltalk/interfaces/MyTableSettings'
import type { ComponentExposed } from 'vue-component-type-helpers'

// todo: fetch information about table
// const tablesStore = useTablesStore()
// const { defaultMyTableName } = storeToRefs(tablesStore)

const resetInvitation = () => {
  invitation.userId = 0
  invitation.userName = ''
  invitation.userAvatar = ''
  invitation.tableId = 1
  invitation.tableName = ''
}

const invitation = reactive<Invitation>({
  userId: 0,
  userName: '',
  userAvatar: '',
  tableId: 0,
  tableName: '',
})
resetInvitation()

// todo: remove test data
invitation.userName = 'Max Mustermann'
invitation.tableName = 'Männerkreis Wintersonnenwende NRW'
// ^^^

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

const stepControl = ref<ComponentExposed<typeof StepControl<MyTableSettings>> | null>(null)

defineExpose({
  reset: () => {
    resetInvitation()
    stepControl.value?.reset()
  },
})
</script>
