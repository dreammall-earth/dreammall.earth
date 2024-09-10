<template>
  <div class="flat-text-field d-flex flex-column text-center pa-4">
    <div class="reminder pa-5 rounded-lg text-white font-weight-medium">
      <p class="text-center">
        {{ $t('dream-mall-panel.setup.reminder') }}
      </p>
    </div>

    <div class="d-flex align-start mt-12">
      <v-text-field
        v-model="tableUrl"
        rounded
        class="elevation-0 w-100 flex-grow-1 mr-3 custom-text-field"
        content-class="elevation-0"
        variant="solo-filled"
        hide-details
        readonly
      />
      <v-btn icon class="custom-icon-btn" @click="copyUrl">
        <v-icon icon="mdi-content-copy" />
      </v-btn>
    </div>

    <SimpleButton class="mt-12 mx-auto" :label="submitText" @click="onSubmit" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import SimpleButton from '#components/buttons/SimpleButton.vue'

import type { StepEmits, StepProps } from '#components/steps/StepComponentTypes'

defineProps<StepProps>()
const emit = defineEmits<StepEmits>()

const onSubmit = () => {
  emit('submit')
}

const tableUrl = ref('https.//asdfasdf.de')

const copyUrl = () => {}
</script>

<style scoped lang="scss">
.reminder {
  background-color: #8b949b; // todo: save globally
}

:root {
  --custom-height: 56px;
}

.custom-text-field {
  :deep(.v-field__input) {
    min-height: var(--custom-height) !important;
    height: var(--custom-height) !important;
    padding-top: 12px;
    padding-bottom: 12px;
  }
}

.custom-icon-btn {
  height: 48px;
  width: 48px;
}
</style>
