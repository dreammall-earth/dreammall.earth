<template>
  <div class="flat-text-field d-flex flex-column text-center pa-4">
    <div class="reminder text-center pa-5 font-weight-medium">
      <LogoImage class="mx-auto" size="tiny" :text-enabled="false" />
      <p class="mt-5">
        {{ $t('dream-mall-panel.setup.reminder') }}
      </p>
    </div>

    <div class="d-flex align-start mt-12">
      <v-text-field
        v-model="tableUrl"
        rounded
        flat
        class="elevation-0 w-100 flex-grow-1 mr-3 custom-text-field"
        :class="{ 'copied-indicator': copiedIndicator }"
        content-class="elevation-0"
        variant="solo-filled"
        hide-details
        readonly
      />
      <v-btn
        icon
        class="custom-icon-btn"
        :class="{ 'copied-indicator': copiedIndicator }"
        @click="copyUrl"
      >
        <v-icon icon="mdi-content-copy" />
      </v-btn>
    </div>

    <SimpleButton class="mt-12 mx-auto" :label="submitText" @click="onSubmit" />
  </div>
</template>

<script lang="ts" setup>
import { navigate } from 'vike/client/router'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import SimpleButton from '#components/buttons/SimpleButton.vue'
import LogoImage from '#components/menu/LogoImage.vue'
import GlobalErrorHandler from '#plugins/globalErrorHandler'
import { copyToClipboard } from '#src/utils/copyToClipboard'
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

const tableSettings = defineModel<MyTableSettings>({ required: true })
const tableId = tableSettings.value.tableId ?? 0
const tableUrl = ref(tablesStore.getJoinTableUrl(tableId))

const copiedIndicator = ref(false)
let timerIndicator: ReturnType<typeof setTimeout> | null = null

const copyUrl = () => {
  copyToClipboard(tableUrl.value, t('globalErrorHandler.copiedToClipboard'))
  copiedIndicator.value = true

  if (timerIndicator) clearTimeout(timerIndicator)

  timerIndicator = setTimeout(() => {
    copiedIndicator.value = false
    timerIndicator = null
  }, 3000)
}

const navigateToTable = async () => {
  if (!tableId) return
  try {
    await navigate(tablesStore.getTableUri(tableId))
  } catch (error) {
    GlobalErrorHandler.error('Error opening table', error)
  }
}
</script>

<style scoped lang="scss">
.reminder {
  color: rgb(var(--v-theme-dm-panel-reminder-text-color));
  background-color: var(--v-dm-panel-reminder-text-background-color);
  border-radius: 24px;
}

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
    border: 1px solid transparent;
    color: rgb(var(--v-theme-dm-panel-reminder-link-color)) !important;
    background-color: var(--v-dm-panel-reminder-link-background-color) !important;
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
