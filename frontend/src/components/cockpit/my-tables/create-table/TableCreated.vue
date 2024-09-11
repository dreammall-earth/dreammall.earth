<template>
  <div>
    <MotivationBox>
      {{ $t('cockpit.myTables.createTable.tableCreated') }}
    </MotivationBox>
    <SimpleButton class="mt-12 mx-auto" :label="props.submitText" @click="openTable" />
  </div>
</template>

<script lang="ts" setup>
import { navigate } from 'vike/client/router'

import SimpleButton from '#components/buttons/SimpleButton.vue'

import MotivationBox from './MotivationBox.vue'

import type { StepEmits, StepProps } from '#components/steps/StepComponentTypes'
import type { CreateTableModel } from './CreateTable.vue'

const createTableModel = defineModel<CreateTableModel>({ required: true })

const props = defineProps<StepProps>()
const emit = defineEmits<StepEmits>()

const openTable = () => {
  emit('next')
  navigate(`/table/${createTableModel.value.tableId}`)
}
</script>
