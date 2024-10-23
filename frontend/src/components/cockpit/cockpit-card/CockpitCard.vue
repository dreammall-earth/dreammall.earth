<template>
  <CockpitCardVariableHeight class="cockpit-card">
    <template v-if="slots.header" #header>
      <slot name="header"></slot>
    </template>
    <template #default>
      <slot name="default"></slot>
    </template>
  </CockpitCardVariableHeight>
</template>

<script setup lang="ts">
import { useSlots } from 'vue'

import CockpitCardVariableHeight from '#components/cockpit/cockpit-card/CockpitCardVariableHeight.vue'

const slots = useSlots()
</script>

<style scoped lang="scss">
.cockpit-card {
  --cockpit-card-height: 323px;

  height: var(--cockpit-card-height);
  max-height: var(--cockpit-card-height);
  overflow: hidden;
}
</style>
