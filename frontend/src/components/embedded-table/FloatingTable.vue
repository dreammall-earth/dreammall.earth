<template>
  <div v-show="isActive" class="container">
    <EmbeddedTable v-if="errorMessage === null" :url="tableUrl" @table-closed="onTableClosed" />
    <div v-else class="test-not-found">
      {{ $t('table.notFound') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import EmbeddedTable from '#components/embedded-table/EmbeddedTable.vue'

import { useTable } from './useTable'

const { errorMessage, tableUrl, isActive, leaveTable } = useTable()

const onTableClosed = () => {
  leaveTable()
}
</script>

<style scoped lang="scss">
@use 'sass:map';
@import 'vuetify/lib/styles/settings/_variables';

.container {
  width: 400px;
  height: 400px;
  display: flex;
  z-index: 1000;
}
</style>
