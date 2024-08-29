<template>
  <div class="flat-text-field d-flex flex-column align-center pa-4 w-100">
    <v-text-field
      v-model="tableNameModel"
      rounded
      class="elevation-0 w-100"
      content-class="elevation-0"
      :label="$t('dream-mall-panel.setup.table-name')"
      variant="solo-filled"
      append-inner-icon="mdi-pencil"
      maxlength="64"
    />
    <!-- todo: manage values as maxlength globally? -->

    <v-switch v-model="isPrivateModel" label="Privat" color="#4caf50" inset hide-details />

    <SimpleButton class="mt-12" :label="submitText" @click="onNext" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import SimpleButton from '#components/buttons/SimpleButton.vue'

import { TableSetupEmits, TableSetupProps } from './TableSetupProps'

const props = defineProps<TableSetupProps>()
const emit = defineEmits<TableSetupEmits>()

const tableNameModel = computed({
  get: () => props.myTableSettings.name,
  set: (value) => {
    emit('tableName:updated', value)
  },
})

const isPrivateModel = computed({
  get: () => !props.myTableSettings.isPublic,
  set: (value) => {
    emit('isPublic:updated', !value)
  },
})

const onNext = () => {
  emit('next')
}
</script>

<style lang="scss">
.flat-text-field .v-field--variant-solo-filled {
  box-shadow: none !important;
}
</style>
