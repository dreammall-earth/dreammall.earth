<template>
  <div class="d-flex align-start">
    <v-text-field
      :model-value="props.tableUrl"
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
  tableUrl: string
}>()

const copiedIndicator = ref(false)
let timerIndicator: ReturnType<typeof setTimeout> | null = null

const toast = inject<typeof Toast>('toast')
const copy = copyToClipboard(toast)

const { t } = useI18n()

const copyUrl = () => {
  copy(props.tableUrl, t('copiedToClipboard'))
  copiedIndicator.value = true

  if (timerIndicator) clearTimeout(timerIndicator)

  timerIndicator = setTimeout(() => {
    copiedIndicator.value = false
    timerIndicator = null
  }, 3000)
}
</script>
