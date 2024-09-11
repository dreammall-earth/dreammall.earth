<template>
  <div>
    <MotivationBox>
      {{ $t('cockpit.myTables.createTable.tableCreated') }}
    </MotivationBox>
    [Copy link]
    <button @click="openTable">Open new table</button>
  </div>
</template>

<script lang="ts" setup>
import { navigate } from 'vike/client/router'

import MotivationBox from './MotivationBox.vue'

import type { StepEmits } from '#components/steps/StepComponentTypes'
import type { CreateTableModel } from './CreateTable.vue'

const createTableModel = defineModel<CreateTableModel>({ required: true })

const emit = defineEmits<StepEmits>()

const openTable = () => {
  emit('next')
  navigate(`/table/${createTableModel.value.tableId}`)
}
</script>
