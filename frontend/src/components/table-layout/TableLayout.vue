<template>
  <DefaultLayout>
    <template #dream-mall-button="{ close }">
      <TableSettings ref="tableSettingsRef" @close="close" />
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
import { ref } from 'vue'

import useDreamMallPanel from '#components/dream-mall-panel/useDreamMallPanel'
import EmbeddedTable from '#components/embedded-table/EmbeddedTable.vue'
import TableSettings from '#components/malltalk/settings/TableSettings.vue'
import DefaultLayout from '#layouts/DefaultLayout.vue'

defineProps<{
  tableUrl: string | null
  errorMessage: string | null
}>()

const { setComponentRef } = useDreamMallPanel()

const tableSettingsRef = ref<InstanceType<typeof TableSettings>>()

setComponentRef(tableSettingsRef, 'table-settings')

const onTableClosed = () => navigate('/')
</script>

<style scoped lang="scss">
@use 'sass:map';
@import 'vuetify/lib/styles/settings/_variables';

.container {
  --bottom-height: 136px;

  width: 100%;
  height: calc(100vh - var(--v-layout-top) - var(--bottom-height));
}

@media #{map.get($display-breakpoints, 'sm-and-down')} {
  .container {
    --bottom-height: 102px;
  }
}
</style>
