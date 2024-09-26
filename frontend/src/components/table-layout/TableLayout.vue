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
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import EmbeddedTable from '#components/embedded-table/EmbeddedTable.vue'
import TableSettings from '#components/malltalk/settings/TableSettings.vue'
import DefaultLayout from '#layouts/DefaultLayout.vue'
import { TableType } from '#stores/tablesStore'

import type { UseQueryReturn } from '@vue/apollo-composable'

const errorMessage = ref<string | null>(null)
const tableUrl = ref<string | null>(null)

const { t } = useI18n()

const props = defineProps<{
  useQueryResult:
    | UseQueryReturn<any, { tableId: number }> // eslint-disable-line @typescript-eslint/no-explicit-any
    | UseQueryReturn<any, Record<string, never>> // eslint-disable-line @typescript-eslint/no-explicit-any
}>()

const { result: joinTableQueryResult, error: joinTableQueryError } = props.useQueryResult

watch(
  joinTableQueryResult,
  (data: { joinTable: { link: string; type: TableType; isModerator: boolean } }) => {
    if (!data.joinTable) return
    tableUrl.value = data.joinTable.link
    errorMessage.value = null
  },
)

// eslint-disable-next-line promise/prefer-await-to-callbacks
watch(joinTableQueryError, (error) => {
  if (!error) return
  errorMessage.value = error.message
  tableUrl.value = null
  throw new Error(t('table.error'), error)
})

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
    --bottom-height: 85px;
  }
}
</style>
