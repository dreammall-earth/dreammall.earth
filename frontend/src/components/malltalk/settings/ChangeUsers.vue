<template>
  <div class="flat-text-field d-flex flex-column align-center pa-4 w-100">
    <UserSelection v-model="tableSettings.users" />

    <div class="align-content-center align-center">
      <SimpleButton class="mt-12 mx-auto" :label="props.submitText" @click="onSubmitUsers" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import GlobalErrorHandler from '#renderer/plugins/globalErrorHandler'
import SimpleButton from '#src/components/buttons/SimpleButton.vue'
import UserSelection from '#src/components/user-selection/UserSelection.vue'
import { useTablesStore } from '#src/stores/tablesStore'

import type MyTableSettings from '#src/components/malltalk/interfaces/MyTableSettings'
import type { StepEmits, StepProps } from '#src/components/steps/StepComponentTypes'

const props = defineProps<StepProps>()
const emit = defineEmits<StepEmits>()
const tableSettings = defineModel<MyTableSettings>({ required: true })

const tablesStore = useTablesStore()

const onSubmitUsers = async (): Promise<string | void> => {
  try {
    await tablesStore.updateMyTableUsers(tableSettings.value.users)
    emit('goTo', 'root')
  } catch (error) {
    GlobalErrorHandler.error('Error occurred by updating the users', error)
  }
}
</script>
