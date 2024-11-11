import { useQuery } from '@vue/apollo-composable'
import { computed } from 'vue'

import { getTableNameQuery } from '#queries/getTableName'

type GetTableNameResult = {
  getTableName: string
}

export default function useGetTableName(tableId: string) {
  const { result, loading, error } = useQuery<GetTableNameResult>(
    getTableNameQuery,
    { tableId },
    {
      prefetch: false,
      fetchPolicy: 'no-cache',
    },
  )

  const tableName = computed(() => result.value?.getTableName)
  const isLoading = computed(() => loading.value)
  const isError = computed(() => !!error.value)

  return {
    tableName,
    isLoading,
    isError,
  }
}
