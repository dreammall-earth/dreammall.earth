<template>
  <div>
    <MotivationBox>
      {{ $t('cockpit.myTables.createTable.tableCreated') }}
    </MotivationBox>
    <CopyToClipboard :url="tableUrl" class="copy-url" />
    <SimpleButton class="mt-12 mx-auto" :label="props.submitText" @click="openTable" />
  </div>
</template>

<script lang="ts" setup>
import { navigate } from 'vike/client/router'

import SimpleButton from '#components/buttons/SimpleButton.vue'
import CopyToClipboard from '#components/copy-to-clipboard/CopyToClipboard.vue'
import { usePageContext } from '#context/usePageContext'
import { useTablesStore } from '#stores/tablesStore'

import MotivationBox from './MotivationBox.vue'

import type { StepEmits, StepProps } from '#components/steps/StepComponentTypes'
import type { CreateTableModel } from './CreateTable.vue'

const tablesStore = useTablesStore()

const pageContext = usePageContext()
const { META } = pageContext.publicEnv

const createTableModel = defineModel<CreateTableModel>({ required: true })
const meetingID = createTableModel.value.meetingID
const tableId = createTableModel.value.tableId

if (!meetingID) throw new Error('Meeting ID is required')
if (!tableId) throw new Error('Table ID is required')

const tableUrl = tablesStore.getJoinTableUrl(meetingID, META.BASE_URL)

const props = defineProps<StepProps>()
const emit = defineEmits<StepEmits>()

const openTable = () => {
  emit('next')
  navigate(`/table/${tableId}`)
}
</script>

<style scoped>
.copy-url {
  width: clamp(230px, 62%, 380px);
}
</style>
