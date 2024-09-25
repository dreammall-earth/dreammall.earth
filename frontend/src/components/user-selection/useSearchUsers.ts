import { useQuery } from '@vue/apollo-composable'
import { computed, ref } from 'vue'

import { searchUsersQuery } from '#queries/searchUsersQuery'

export type SearchUser = {
  id: number
  name: string
  username: string
}

type SearchUsersResult = {
  users: SearchUser[]
}

export default function useSearchUsers() {
  const searchString = ref('')

  const {
    result,
    loading,
    error: queryError,
    refetch,
  } = useQuery<SearchUsersResult>(
    searchUsersQuery,
    () => ({ searchString: searchString.value }),
    () => ({
      enabled: true,
      fetchPolicy: 'no-cache',
    }),
  )

  const searchResults = computed(() => result.value?.users || [])
  const isLoading = computed(() => loading.value)
  const error = computed(() => queryError.value)

  const searchUsers = async (query: string) => {
    searchString.value = query
    try {
      await refetch({ searchString: searchString.value })
    } catch (cause) {
      throw new Error('Error searching users:', { cause })
    }
  }

  return {
    searchResults,
    isLoading,
    error,
    searchUsers,
  }
}
