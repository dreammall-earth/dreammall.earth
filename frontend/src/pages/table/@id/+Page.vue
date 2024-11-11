<template>
  <TableLayout :table-url="tableUrl" :error-message="errorMessage"></TableLayout>
</template>

<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { provide, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { usePageContext } from '#context/usePageContext'
import {
  IsModeratorInjection,
  IsModeratorSymbol,
} from '#layouts/malltalk/interfaces/IsModeratorInjection'
import TableLayout from '#pages/table/(components)/table-layout/TableLayout.vue'
import { joinTableQuery } from '#queries/joinTableQuery'

import type { TableType } from '#stores/tablesStore'

const pageContext = usePageContext()
const { t } = useI18n()

const tableId = ref(Number(pageContext.routeParams?.id))

const isModeratorData: IsModeratorInjection = {
  isModerator: ref(false),
}
provide(IsModeratorSymbol, isModeratorData)

const errorMessage = ref<string | null>(null)
const tableUrl = ref<string | null>(null)

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

watch(
  joinTableQueryResult,
  (data: { joinTable: { link: string; type: TableType; isModerator: boolean } }) => {
    if (!data.joinTable) return
    tableUrl.value = data.joinTable.link
    isModeratorData.isModerator.value = data.joinTable.isModerator
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
</script>
