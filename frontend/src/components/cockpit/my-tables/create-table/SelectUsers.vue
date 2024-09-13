<template>
  <div>
    <MotivationBox>
      {{ $t('cockpit.myTables.createTable.chooseModerators') }}
    </MotivationBox>
    <UserSelection v-model="createTableModel.userIds" />

    <div class="align-content-center align-center">
      <SimpleButton class="mt-12 mx-auto" :label="props.submitText" @click="$emit('submit')" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import SimpleButton from '#src/components/buttons/SimpleButton.vue'
import UserSelection from '#src/components/user-selection/UserSelection.vue'

import MotivationBox from './MotivationBox.vue'

import type { StepEmits, StepProps } from '#src/components/steps/StepComponentTypes'
import type { CreateTableModel } from './CreateTable.vue'

const props = defineProps<StepProps>()
defineEmits<StepEmits>()
const createTableModel = defineModel<CreateTableModel>({ required: true })
</script>
