import { useQuery } from '@vue/apollo-composable'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

import { currentUserQuery } from '#queries/currentUserQuery'

export type UserInRoom = {
  id: number
  role: 'VIEWER' | 'MODERATOR'
  name: string
  username: string
}

export type MyRoom = {
  id: number
  name: string
  public: boolean
  users: UserInRoom[]
}

export type CurrentUser = {
  id: number
  name: string
  username: string
  room?: MyRoom
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

    const getMyRoom = computed(() => currentUser.value?.room)

    const getUsersInMyRoom = computed(() => currentUser.value?.room?.users)

    const getCurrentUserAvatar = computed(() => null)

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
      getMyRoom,
      getUsersInMyRoom,
    }
  },
  {
    persist: true,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
