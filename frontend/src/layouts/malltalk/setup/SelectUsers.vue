<template>
  <div class="flat-text-field d-flex flex-column align-center pa-4 w-100">
    <UserSelection v-model="tableSettings.users" />

    <div class="align-content-center align-center">
      <SimpleButton class="mt-12 mx-auto" :label="props.submitText" @click="onNext" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import SimpleButton from '#components/simple-button/SimpleButton.vue'
import UserSelection from '#components/user-selection/UserSelection.vue'

import type { StepEmits, StepProps } from '#components/steps/StepComponentTypes'
import type MyTableSettings from '#layouts/malltalk/interfaces/MyTableSettings'

const props = defineProps<StepProps>()
const emit = defineEmits<StepEmits>()
const tableSettings = defineModel<MyTableSettings>({ required: true })

const onNext = () => {
  emit('submit')
}
</script>
