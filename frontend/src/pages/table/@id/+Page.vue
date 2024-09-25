<template>
  <TableLayout :use-query-result="useQueryResult"></TableLayout>
</template>

<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { ref, watch } from 'vue'

import TableLayout from '#components/table-layout/TableLayout.vue'
import { usePageContext } from '#context/usePageContext'
import { joinTableQuery } from '#queries/joinTableQuery'

const pageContext = usePageContext()

const tableId = ref(Number(pageContext.routeParams?.id))

watch(pageContext, (context) => {
  tableId.value = Number(context.routeParams?.id)
})

// const { result: joinTableQueryResult, error: joinTableQueryError } = useQuery(
const useQueryResult = useQuery(
  joinTableQuery,
  () => ({
    tableId: tableId.value,
  }),
  {
    prefetch: false,
    fetchPolicy: 'no-cache',
  },
)
</script>
