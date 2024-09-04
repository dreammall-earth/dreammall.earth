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
import { useQuery } from '@vue/apollo-composable'
import { navigate } from 'vike/client/router'
import { ref, watch } from 'vue'

import EmbeddedTable from '#components/embedded-table/EmbeddedTable.vue'
import { usePageContext } from '#context/usePageContext'
import DefaultLayout from '#layouts/DefaultLayout.vue'
import GlobalErrorHandler from '#plugins/globalErrorHandler'
import { joinTableQuery } from '#queries/joinTableQuery'
import TableSettings from '#src/panels/dreammall/TableSettings.vue'

const tableUrl = ref<string | null>(null)

const pageContext = usePageContext()

const tableId = ref(Number(pageContext.routeParams?.id))

const errorMessage = ref<string | null>(null)

watch(pageContext, (context) => {
  tableId.value = Number(context.routeParams?.id)
})

const { result: joinTableQueryResult, error: joinTableQueryError } = useQuery(
  joinTableQuery,
  () => ({
    tableId: tableId.value,
  }),
  {
    prefetch: false,
    fetchPolicy: 'no-cache',
  },
)

watch(joinTableQueryResult, (data: { joinTable: string }) => {
  if (!data.joinTable) return
  tableUrl.value = data.joinTable
  errorMessage.value = null
})

// eslint-disable-next-line promise/prefer-await-to-callbacks
watch(joinTableQueryError, (error) => {
  if (!error) return
  GlobalErrorHandler.error('Error opening table', error)
  errorMessage.value = error.message
  tableUrl.value = null
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
