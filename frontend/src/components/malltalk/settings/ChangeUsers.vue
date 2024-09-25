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
import UserSelection from '#components/user-selection/UserSelection.vue'
import { useTablesStore } from '#stores/tablesStore'

import type MyTableSettings from '#components/malltalk/interfaces/MyTableSettings'
import type { StepEmits, StepProps } from '#components/steps/StepComponentTypes'

const props = defineProps<StepProps>()
const emit = defineEmits<StepEmits>()
const tableSettings = defineModel<MyTableSettings>({ required: true })

const tablesStore = useTablesStore()

const onSubmitUsers = async (): Promise<string | void> => {
  try {
    await tablesStore.updateMyTableUsers(tableSettings.value.users)
    emit('goTo', 'root')
  } catch (cause) {
    throw new Error('Error occurred by updating the users', { cause })
  }
}
</script>
