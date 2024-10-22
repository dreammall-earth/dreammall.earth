<template>
  <DefaultLayout>
    <template #dream-mall-button="{ close }">
      <TableSettings ref="tableSetupRef" @close="close" />
    </template>
    <template #default>
      <div class="container">
        <EmbeddedTable v-if="errorMessage === null" :url="tableUrl" @table-closed="onTableClosed" />
        <div v-else class="test-not-found">
          {{ $t('table.notFound') }}
        </div>
      </div>
    </template>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { navigate } from 'vike/client/router'

import EmbeddedTable from '#components/embedded-table/EmbeddedTable.vue'
import TableSettings from '#components/malltalk/settings/TableSettings.vue'
import DefaultLayout from '#layouts/DefaultLayout.vue'

defineProps<{
  tableUrl: string | null
  errorMessage: string | null
}>()

const onTableClosed = () => navigate('/')
</script>

<style scoped lang="scss">
@use 'sass:map';
@use 'vuetify/lib/styles/settings/_variables' as variables;

.container {
  --bottom-height: 136px;

  width: 100%;
  height: calc(100vh - var(--v-layout-top) - var(--bottom-height));
}

@media #{map.get(variables.$display-breakpoints, 'sm-and-down')} {
  .container {
    --bottom-height: 102px;
  }
}
</style>
