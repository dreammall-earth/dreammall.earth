<template>
  <div class="flat-text-field d-flex flex-column text-center pa-4">
    <InfoBox :text="$t('dream-mall-panel.setup.reminder')" />

    <CopyToClipboard :url="tableUrl" class="mt-12" />

    <SimpleButton class="mt-12 mx-auto" :label="submitText" @click="onSubmit" />
  </div>
</template>

<script lang="ts" setup>
import { navigate } from 'vike/client/router'
import { useI18n } from 'vue-i18n'

import SimpleButton from '#components/buttons/SimpleButton.vue'
import CopyToClipboard from '#components/copy-to-clipboard/CopyToClipboard.vue'
import InfoBox from '#components/info-box/InfoBox.vue'
import { usePageContext } from '#context/usePageContext'
import { useTablesStore } from '#stores/tablesStore'

import type MyTableSettings from '#components/malltalk/interfaces/MyTableSettings'
import type { StepEmits, StepProps } from '#components/steps/StepComponentTypes'

defineProps<StepProps>()
const emit = defineEmits<StepEmits>()

const onSubmit = async () => {
  emit('next')
  await navigateToTable()
}

const { t } = useI18n()

const tablesStore = useTablesStore()

const pageContext = usePageContext()
const { META } = pageContext.publicEnv

const tableSettings = defineModel<MyTableSettings>({ required: true })

const tableId = tableSettings.value.tableId ?? 0

const meetingID = tableSettings.value.meetingID ?? ''

const tableUrl = tablesStore.getJoinTableUrl(meetingID, META.BASE_URL)

const navigateToTable = async () => {
  if (!tableId) return
  try {
    await navigate(tablesStore.getTableUri(tableId))
  } catch (cause) {
    throw new Error(t('table.error'), { cause })
  }
}
</script>

<style scoped lang="scss">
.reminder {
  color: rgb(var(--v-theme-dm-panel-reminder-text-color));
  background-color: var(--v-dm-panel-reminder-text-background-color);
  border-radius: 24px;
}
</style>
