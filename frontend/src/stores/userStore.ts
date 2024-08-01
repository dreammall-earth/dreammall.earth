import { useQuery } from '@vue/apollo-composable'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

import { currentUserQuery } from '#queries/currentUserQuery'

export type UserInTable = {
  id: number
  role: 'VIEWER' | 'MODERATOR'
  name: string
  username: string
}

export type MyTable = {
  id: number
  name: string
  public: boolean
  users: UserInTable[]
}

export type CurrentUser = {
  id: number
  name: string
  username: string
  avatar?: string
  table?: MyTable
}

export const useUserStore = defineStore(
  'user',
  () => {
    const currentUser = ref<CurrentUser | null>(null)

    const { result: currentUserQueryResult } = useQuery(
      currentUserQuery,
      {},
      {
        prefetch: false,
        fetchPolicy: 'no-cache',
      },
    )

    watch(currentUserQueryResult, (data: { currentUser: CurrentUser }) => {
      setCurrentUser(data.currentUser)
    })

    const getCurrentUser = computed(() => currentUser.value)

    const getMyTable = computed(() => currentUser.value?.table)

    const getUsersInMyTable = computed(() => currentUser.value?.table?.users)

    const getCurrentUserAvatar = computed(() => currentUser.value?.avatar)

    const getCurrentUserInitials = computed(() => {
      const name = currentUser.value?.name
      if (name)
        return name
          .split(' ')
          .map((n) => n.charAt(0))
          .join('')
      return ''
    })

    const setCurrentUser = (user: CurrentUser) => {
      currentUser.value = user
    }

    return {
      currentUser,
      getCurrentUser,
      setCurrentUser,
      getCurrentUserInitials,
      getCurrentUserAvatar,
      getMyTable,
      getUsersInMyTable,
    }
  },
  {
    persist: true,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
