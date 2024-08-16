import { useQuery } from '@vue/apollo-composable'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

import { searchUsersQuery } from '#queries/searchUsersQuery'

export type SearchUser = {
  id: number
  name: string
  username: string
}

type SearchUsersResult = {
  users: SearchUser[]
}

export const useSearchUsersStore = defineStore('searchUsers', () => {
  const searchResults = ref<SearchUser[]>([])
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
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

  watch(result, (newResult) => {
    if (newResult?.users) {
      searchResults.value = newResult.users
    } else {
      searchResults.value = []
    }
  })

  watch(loading, (newLoading) => {
    isLoading.value = newLoading
  })

  watch(queryError, (newError) => {
    error.value = newError
  })

  const searchUsers = async (query: string) => {
    searchString.value = query
    isLoading.value = true
    error.value = null
    try {
      await refetch()
    } catch (e) {
      error.value = e instanceof Error ? e : new Error('An unknown error occurred')
    } finally {
      isLoading.value = false
    }
  }

  return {
    searchResults,
    isLoading,
    error,
    searchUsers,
  }
})
