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
import SimpleButton from '#components/buttons/SimpleButton.vue'
import MotivationBox from '#components/motivation-box/MotivationBox.vue'
import UserSelection from '#components/user-selection/UserSelection.vue'

import type { StepEmits, StepProps } from '#components/steps/StepComponentTypes'
import type { CreateTableModel } from './CreateTable.vue'

const props = defineProps<StepProps>()
defineEmits<StepEmits>()
const createTableModel = defineModel<CreateTableModel>({ required: true })
</script>
