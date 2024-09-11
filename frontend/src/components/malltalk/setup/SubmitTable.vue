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
import { ref } from 'vue'

import SimpleButton from '#components/buttons/SimpleButton.vue'
import LogoImage from '#components/menu/LogoImage.vue'
import { copyToClipboard } from '#src/utils/copyToClipboard'
import { useTablesStore } from '#stores/tablesStore'

import type { StepEmits, StepProps } from '#components/steps/StepComponentTypes'
import {useI18n} from "vue-i18n";
import {useUserStore} from "#stores/userStore";

defineProps<StepProps>()
const emit = defineEmits<StepEmits>()

const onSubmit = () => {
  emit('submit')
}

const { t } = useI18n()

const userStore = useUserStore()
const tablesStore = useTablesStore()

const tableId = userStore.getMyTable?.id ?? 0
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
</script>

<style scoped lang="scss">
.reminder {
  border-radius: 24px;

  color: rgb(var(--v-theme-dm-panel-reminder-text-color));
  background-color: var(--v-dm-panel-reminder-text-background-color);
}

:root {
  --custom-height: 48px;
}

.custom-text-field {
  :deep(.v-field__input) {
    min-height: var(--custom-height) !important;
    height: var(--custom-height) !important;
    padding-top: 12px;
    padding-bottom: 12px;
  }

  :deep(.v-field) {
    color: rgb(var(--v-theme-dm-panel-reminder-link-color)) !important;
    background-color: var(--v-dm-panel-reminder-link-background-color) !important;
  }

  :deep(input) {
    color: var(--v-theme-dm-panel-reminder-link-color) !important;
  }

  :deep(.v-field) {
    border: 1px solid transparent;
  }

  &.copied-indicator {
    :deep(.v-field) {
      border: 1px solid rgb(var(--v-theme-dm-panel-call-action-button-indicator-background-color));
    }
  }
}

.custom-icon-btn {
  height: 48px;
  width: 48px;
  box-shadow: none !important;

  color: rgb(var(--v-theme-dm-panel-reminder-link-color)) !important;
  background-color: var(--v-dm-panel-reminder-link-background-color) !important;

  &.copied-indicator {
    color: rgb(var(--v-theme-dm-panel-call-action-button-indicator-color)) !important;
    background-color: rgb(var(--v-theme-dm-panel-call-action-button-indicator-background-color)) !important;
  }
}
</style>
