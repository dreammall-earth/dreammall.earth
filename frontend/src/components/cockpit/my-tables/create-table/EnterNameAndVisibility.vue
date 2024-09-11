<template>
  <form class="flat-text-field d-flex flex-column align-center pa-4 w-100" @submit.prevent="onNext">
    <v-text-field
      v-model="createTableModel.name"
      rounded
      class="elevation-0 w-100"
      content-class="elevation-0"
      :label="$t('dream-mall-panel.setup.table-name')"
      variant="solo-filled"
      append-inner-icon="mdi-pencil"
      maxlength="64"
      required
    />
    <!-- todo: manage values as maxlength globally? -->

    <v-switch
      v-model="createTableModel.isPrivate"
      label="Privat"
      color="#4caf50"
      inset
      hide-details
    />

    <SimpleButton type="submit" class="mt-12" :label="submitText" />
  </form>
</template>

<script setup lang="ts">
import SimpleButton from '#components/buttons/SimpleButton.vue'

import type { StepEmits, StepProps } from '#components/steps/StepComponentTypes'
import type { CreateTableModel } from './CreateTable.vue'

defineProps<StepProps>()
const emit = defineEmits<StepEmits>()

const createTableModel = defineModel<CreateTableModel>({ required: true })

const onNext = () => {
  if (createTableModel.value.isPrivate) {
    emit('next')
  } else {
    emit('submit')
  }
}
</script>

<style lang="scss" scoped>
.flat-text-field .v-field--variant-solo-filled {
  box-shadow: none !important;
}
</style>
