<template>
  <SimpleButton
    :label="$t('dream-mall-panel.setup.table-creation')"
    icon="mdi-video"
    class="mb-5"
    @click="onClick"
  />
</template>

<script setup lang="ts">
import SimpleButton from '#src/components/buttons/SimpleButton.vue'

import type { StepEmits } from '#src/components/steps/StepComponentTypes'

const emit = defineEmits<StepEmits>()

const onClick = () => {
  emit('next')
}
</script>
