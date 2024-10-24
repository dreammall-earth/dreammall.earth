<template>
  <div class="d-flex align-start">
    <v-text-field
      :model-value="props.url"
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
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { useI18n } from 'vue-i18n'

import { copyToClipboard } from '#src/utils/copyToClipboard'

import type { toast as Toast } from 'vue3-toastify'

const props = defineProps<{
  url: string
}>()

const copiedIndicator = ref(false)
let timerIndicator: ReturnType<typeof setTimeout> | null = null

const toast = inject<typeof Toast>('toast')
const copy = copyToClipboard(toast)

const { t } = useI18n()

const copyUrl = () => {
  copy(props.url, t('copiedToClipboard'))
  copiedIndicator.value = true

  if (timerIndicator) clearTimeout(timerIndicator)

  timerIndicator = setTimeout(() => {
    copiedIndicator.value = false
    timerIndicator = null
  }, 3000)
}
</script>

<style scoped lang="scss">
.custom-text-field {
  --custom-height: 48px;

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
