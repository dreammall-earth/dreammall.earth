<template>
  <div class="flat-text-field d-flex flex-column text-center pa-4">
    <InfoBox :text="$t('dream-mall-panel.setup.reminder')" />

    <CopyToClipboard :table-url="tableUrl" class="mt-12" />

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
const tableUrl = tablesStore.getJoinTableUrl(tableId, META.BASE_URL)

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
:root {
  --custom-height: 48px;
}

.custom-text-field {
  :deep(.v-field__input) {
    height: var(--custom-height) !important;
    min-height: var(--custom-height) !important;
    padding-top: 12px;
    padding-bottom: 12px;
  }

  :deep(.v-field) {
    color: rgb(var(--v-theme-dm-panel-reminder-link-color)) !important;
    background-color: var(--v-dm-panel-reminder-link-background-color) !important;
    border: 1px solid transparent;
  }

  :deep(input) {
    color: var(--v-theme-dm-panel-reminder-link-color) !important;
  }

  &.copied-indicator {
    :deep(.v-field) {
      border: 1px solid rgb(var(--v-theme-dm-panel-call-action-button-indicator-background-color));
    }
  }
}

.custom-icon-btn {
  width: 48px;
  height: 48px;
  color: rgb(var(--v-theme-dm-panel-reminder-link-color)) !important;
  background-color: var(--v-dm-panel-reminder-link-background-color) !important;
  box-shadow: none !important;

  &.copied-indicator {
    color: rgb(var(--v-theme-dm-panel-call-action-button-indicator-color)) !important;
    background-color: rgb(
      var(--v-theme-dm-panel-call-action-button-indicator-background-color)
    ) !important;
  }
}
</style>
