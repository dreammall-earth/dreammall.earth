<template>
  <div class="flat-text-field d-flex flex-column align-center pa-4 w-100">
    <UserSelection v-model="createTableModel.userIds" />

    <div class="align-content-center align-center">
      <SimpleButton class="mt-12 mx-auto" :label="props.submitText" @click="$emit('submit')" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import SimpleButton from '#components/buttons/SimpleButton.vue'
import UserSelection from '#components/user-selection/UserSelection.vue'

import type { StepEmits, StepProps } from '#components/steps/StepComponentTypes'
import type { CreateTableModel } from './CreateTable.vue'

const props = defineProps<StepProps>()
defineEmits<StepEmits>()
const createTableModel = defineModel<CreateTableModel>({ required: true })
</script>
