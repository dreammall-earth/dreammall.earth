<template>
  <section class="cockpit-card">
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
</script>

<style scoped lang="scss">
@use 'sass:map';
@import 'vuetify/lib/styles/settings/_variables';

.cockpit-card {
  --padding: 20px;
  --card-width: 100%;

  max-width: var(--card-width, 100%);
  padding: var(--padding);
  background-color: var(--v-sidebar-background);
  border-radius: 20px;
}

.header {
  display: flex;
  flex-flow: column;
  justify-content: center;
  height: 28px;
  text-wrap: nowrap;
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
</style>
