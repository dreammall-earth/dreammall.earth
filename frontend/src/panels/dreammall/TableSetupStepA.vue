<template>
  <SimpleButton
    :label="$t('dream-mall-panel.setup.table-creation')"
    icon="mdi-video"
    class="mb-5"
    @click="onClick"
  />
</template>

<script setup lang="ts">
import SimpleButton from '#components/buttons/SimpleButton.vue'

import type { StepEmits } from '#src/panels/composables/useSteps'

const emit = defineEmits<StepEmits>()

const onClick = () => {
  emit('next')
}
</script>
