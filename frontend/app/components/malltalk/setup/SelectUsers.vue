<template>
  <div class="flat-text-field d-flex flex-column align-center pa-4 w-100">
    <UserSelection v-model="tableSettings.users" />

    <div class="align-content-center align-center">
      <SimpleButton class="mt-12 mx-auto" :label="props.submitText" @click="onNext" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import SimpleButton from '#app/components/buttons/SimpleButton.vue'
import UserSelection from '#app/components/user-selection/UserSelection.vue'

import type MyTableSettings from '#app/components/malltalk/interfaces/MyTableSettings'
import type { StepEmits, StepProps } from '#app/components/steps/StepComponentTypes'

const props = defineProps<StepProps>()
const emit = defineEmits<StepEmits>()
const tableSettings = defineModel<MyTableSettings>({ required: true })

const onNext = () => {
  emit('submit')
}
</script>
