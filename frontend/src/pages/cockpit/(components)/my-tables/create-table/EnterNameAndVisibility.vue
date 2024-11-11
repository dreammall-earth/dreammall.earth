<template>
  <form @submit.prevent="$emit('next')">
    <MotivationBox>
      {{ $t('cockpit.myTables.createTable.visionIntoReality') }}
    </MotivationBox>
    <v-text-field
      v-model="createTableModel.name"
      flat
      rounded
      class="elevation-0 w-100"
      content-class="elevation-0"
      :label="$t('dream-mall-panel.setup.table-name')"
      variant="solo-filled"
      append-inner-icon="$custom-stylus-note"
      maxlength="64"
      required
      autofocus
    />
    <!-- todo: manage values as maxlength globally? -->

    <PrivateSwitch v-model="createTableModel.isPrivate" />

    <SimpleButton type="submit" class="mt-12" :label="submitText" />
  </form>
</template>

<script setup lang="ts">
import SimpleButton from '#components/simple-button/SimpleButton.vue'
import PrivateSwitch from '#pages/cockpit/(components)/my-tables/private-switch/PrivateSwitch.vue'

import MotivationBox from './MotivationBox.vue'

import type { StepEmits, StepProps } from '#components/steps/StepComponentTypes'
import type { CreateTableModel } from './CreateTable.vue'

defineProps<StepProps>()
defineEmits<StepEmits>()

const createTableModel = defineModel<CreateTableModel>({ required: true })
</script>

<style scoped lang="scss">
.private-switch {
  :deep(.v-label) {
    width: 80px;
  }
}
</style>
