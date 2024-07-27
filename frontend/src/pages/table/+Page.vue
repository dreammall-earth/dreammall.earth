<template>
  <DefaultLayout>
    <div class="container">
      <EmbeddedTable :url="tableUrl" />
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import EmbeddedTable from '#components/embedded-table/EmbeddedTable.vue'
import DefaultLayout from '#layouts/DefaultLayout.vue'
import { useActiveTableStore } from '#stores/activeTableStore'

const activeTableStore = useActiveTableStore()

const { activeTable: tableUrl } = storeToRefs(activeTableStore)
</script>

<style scoped lang="scss">
@import 'vuetify/lib/styles/settings/_variables';

.container {
  --bottom-height: 16px;

  width: 100%;
  height: calc(100vh - var(--v-layout-top) - var(--bottom-height));
}

@media #{map-get($display-breakpoints, 'sm-and-down')} {
  .container {
    --bottom-height: 85px;
  }
}
</style>
