<template>
  <section class="cockpit-card" :class="{ narrow: props.narrow }">
    <div v-if="slots.header" class="header">
      <slot name="header"></slot>
    </div>
    <hr v-if="slots.header" class="hr" />
    <slot></slot>
  </section>
</template>

<script setup lang="ts">
import { useSlots } from 'vue'

const slots = useSlots()

const props = defineProps<{
  narrow?: boolean
}>()
</script>

<style scoped lang="scss">
.cockpit-card {
  --padding: 20px;
  --cockpit-card-height: 323px;

  max-height: var(--cockpit-card-height);
  padding: var(--padding);
  background-color: var(--v-sidebar-background);
  border-radius: 20px;
}

.header:deep(h2) {
  font-size: 16px;
}

.hr {
  margin-block: 15px;
  margin-inline: calc(-1 * var(--padding));
  border-color: rgb(var(--v-theme-background));
  border-style: solid;
  border-width: 0.5px;
}

.narrow {
  max-width: 335px;
}
</style>
