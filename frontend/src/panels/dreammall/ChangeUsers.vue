<template>
  <div class="flat-text-field d-flex flex-column align-center pa-4 w-100">
    <UserSelection v-model="tableSettings.users" />

    <div class="align-content-center align-center">
      <SimpleButton class="mt-12 mx-auto" :label="props.submitText" @click="onSubmitUsers" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import SimpleButton from '#components/buttons/SimpleButton.vue'
import GlobalErrorHandler from '#plugins/globalErrorHandler'
import UserSelection from '#src/panels/components/UserSelection.vue'
import { useTablesStore } from '#stores/tablesStore'

import type { StepProps, StepEmits } from '#src/panels/composables/useSteps'
import type MyTableSettings from './interfaces/MyTableSettings'

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
