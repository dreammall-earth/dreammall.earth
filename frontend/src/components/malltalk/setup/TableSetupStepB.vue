<template>
  <div class="flat-text-field d-flex flex-column align-center pa-4 w-100">
    <v-text-field
      v-model="tableSettings.name"
      rounded
      class="elevation-0 w-100"
      content-class="elevation-0"
      :label="$t('dream-mall-panel.setup.table-name')"
      variant="solo-filled"
      append-inner-icon="mdi-pencil"
      maxlength="64"
    />
    <!-- todo: manage values as maxlength globally? -->

    <v-switch v-model="tableSettings.isPrivate" label="Privat" color="#4caf50" inset hide-details />

    <SimpleButton class="mt-12" :label="submitText" @click="onNext" />
  </div>
</template>

<script setup lang="ts">
import SimpleButton from '#components/buttons/SimpleButton.vue'

import type MyTableSettings from '#components/malltalk/interfaces/MyTableSettings'
import type { StepEmits, StepProps } from '#components/steps/StepComponentTypes'

defineProps<StepProps>()
const emit = defineEmits<StepEmits>()

const tableSettings = defineModel<MyTableSettings>({ required: true })

const onNext = () => {
  emit('next')
}
</script>

<style lang="scss" scoped>
.flat-text-field .v-field--variant-solo-filled {
  box-shadow: none !important;
}
</style>
./StepProps #src/panels/dreammall-button-drawer/interfaces/MyTableSettings.js
