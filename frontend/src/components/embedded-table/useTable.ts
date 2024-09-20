import { useLazyQuery } from '@vue/apollo-composable'
import { ref, watch, computed } from 'vue'

import GlobalErrorHandler from '#plugins/globalErrorHandler'
import { joinTableQuery } from '#queries/joinTableQuery'

const tableUrl = ref<string | null>(null)

const tableId = ref<number | null>(null)

const errorMessage = ref<string | null>(null)

export const useTable = () => {
  const getTableId = computed(() => tableId.value)

  const {
    load,
    result: joinTableQueryResult,
    error: joinTableQueryError,
  } = useLazyQuery(
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

  const setTableId = async (id: number) => {
    tableId.value = id
    await load()
  }

  const isActive = computed(() => tableId.value !== null)

  const leaveTable = () => {
    tableId.value = null
  }

  return {
    loadTable: load,
    getTableId,
    setTableId,
    tableUrl,
    isActive,
    leaveTable,
    errorMessage,
  }
}
