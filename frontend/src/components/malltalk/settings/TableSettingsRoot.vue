<template>
  <div class="flat-text-field d-flex flex-column align-center pa-4 w-100">
    <v-row no-gutters>
      <v-col cols="12">
        <v-btn-group variant="outlined" class="rounded-lg" divided>
          <v-btn class="px-6" @click="copyToClipboard">
            <v-icon icon="mdi-link" class="mr-2" />
            {{ $t('dream-mall-panel.call.link') }}
          </v-btn>
          <v-btn class="px-6" @click="onClick('settings')">
            <v-icon icon="mdi-pencil" class="mr-2" />
            {{ $t('dream-mall-panel.call.edit') }}
          </v-btn>
          <v-btn class="px-6" @click="onClick('users')">
            <v-icon icon="mdi-account-plus" class="mr-2" />
            {{ $t('dream-mall-panel.call.add-user') }}
          </v-btn>
        </v-btn-group>
      </v-col>
    </v-row>
    <SimpleButton
      :label="$t('dream-mall-panel.call.leave-table')"
      class="leaveButton mt-12 mb-5"
      @click="leaveTable"
    />
  </div>
</template>

<script setup lang="ts">
import { navigate } from 'vike/client/router'
import { ref } from 'vue'

import SimpleButton from '#components/buttons/SimpleButton.vue'
import { copyToClipboard } from '#src/utils/copyToClipboard'

import type { StepEmits, StepProps } from '#components/steps/StepComponentTypes'

defineProps<StepProps>()
const emit = defineEmits<StepEmits>()

const onClick = (stepId: string) => {
  emit('goTo', stepId)
}

const buttons = ref([
  {
    icon: 'mdi-content-copy',
    text: 'Link',
    action: () => copyToClipboard(),
  },
  {
    icon: 'mdi-account-multiple-plus-outline',
    text: 'Add',
    action: () => onClick('users'),
  },
])

const leaveTable = () => {
  navigate('/')
}
</script>

<style scoped lang="scss">
.roundButton {
  color: #3d4753;
  background-color: #ffffff;
}
.roundButton-DarkTheme {
  color: #f5f5f5;
  background-color: #8b949b;
}
.leaveButton {
  background-color: #f44336;
}
</style>
