<template>
  <form class="d-flex flex-column align-center pa-4 w-100" @submit.prevent="onNext">
    <v-text-field
      v-model="tableSettings.name"
      rounded
      flat
      class="custom-text-field elevation-0 w-100"
      content-class="elevation-0"
      :label="$t('dream-mall-panel.setup.table-name')"
      variant="solo-filled"
      append-inner-icon="$custom-stylus-note"
      maxlength="64"
      required
    />
    <!-- todo: manage values as maxlength globally? -->

    <v-switch
      v-model="tableSettings.isPrivate"
      :label="
        tableSettings.isPrivate
          ? $t('dream-mall-panel.setup.private')
          : $t('dream-mall-panel.setup.public')
      "
      hide-details
      class="private-switch"
    />

    <SimpleButton type="submit" class="mt-12" :label="submitText" />
  </form>
</template>

<script setup lang="ts">
import SimpleButton from '#components/simple-button/SimpleButton.vue'

import type { StepEmits, StepProps } from '#components/steps/StepComponentTypes'
import type MyTableSettings from '#layouts/malltalk/interfaces/MyTableSettings.js'

defineProps<StepProps>()
const emit = defineEmits<StepEmits>()

const tableSettings = defineModel<MyTableSettings>({ required: true })

const onNext = () => emit('next')
</script>

<style lang="scss" scoped>
.custom-text-field {
  :deep(.v-field) {
    color: rgb(var(--v-theme-dm-panel-text-input-color)) !important;
    background-color: var(--v-dm-panel-text-input-background-color) !important;
  }

  :deep(input) {
    color: rgb(var(--v-theme-dm-panel-text-input-color)) !important;
  }
}

.private-switch {
  :deep(.v-label) {
    width: 80px;
  }
}
</style>
