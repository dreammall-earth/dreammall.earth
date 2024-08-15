<template>
  <DefaultLayout>
    <div class="container">
      <EmbeddedTable :url="tableUrl" @table-closed="onTableClosed" />
    </div>
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

const tableUrl = ref<string | null>(null)

const pageContext = usePageContext()

const tableId = Number(pageContext.routeParams?.id)

const { result: joinTableQueryResult, error: joinTableQueryError } = useQuery(
  joinTableQuery,
  () => ({
    tableId,
  }),
  {
    prefetch: false,
    fetchPolicy: 'no-cache',
  },
)

watch(joinTableQueryResult, (data: { joinTable: string }) => {
  tableUrl.value = data.joinTable
})

// eslint-disable-next-line promise/prefer-await-to-callbacks
watch(joinTableQueryError, (error) => {
  GlobalErrorHandler.error('Error opening table', error)
})

const onTableClosed = () => navigate('/')
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
