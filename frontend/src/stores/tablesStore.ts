import { useMutation, useQuery, useSubscription } from '@vue/apollo-composable'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

import { createMyTableMutation } from '#mutations/createMyTableMutation'
import { joinMyTableMutation } from '#mutations/joinMyTableMutation'
import { updateMyTableMutation } from '#mutations/updateMyTableMutation'
import { openTablesQuery } from '#src/graphql/queries/openTablesQuery'
import { useAuthStore } from '#stores/authStore'
import { updateOpenTablesSubscription } from '#subscriptions/updateOpenTablesSubscription'

type Attendee = {
  fullName: string
}

export type Table = {
  id: number
  meetingID: string
  meetingName: string
  startTime: string
  participantCount: number
  attendees: Attendee[]
}

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

type CreateMyRoomResult = {
  createMyRoom: MyTable
}

type UpdateMyRoomResult = {
  updateMyRoom: MyTable
}

type JoinMyTableResult = {
  joinMyTable: number
}

export const useTablesStore = defineStore(
  'tables',
  () => {
    const authStore = useAuthStore()

    const name = authStore.user?.profile.name
    const myTable = ref<MyTable | null>(null)

    const { result: openTablesQueryResult, loading } = useQuery(
      openTablesQuery,
      {},
      {
        prefetch: false,
        fetchPolicy: 'no-cache',
      },
    )

    watch(openTablesQueryResult, (data: { openTables: Table[] }) => {
      setTables(data.openTables)
    })

    const { result: updateOpenTablesSubscriptionResult } = useSubscription(
      updateOpenTablesSubscription,
      { username: name || 'Unknown User' },
      { fetchPolicy: 'no-cache' },
    )

    watch(updateOpenTablesSubscriptionResult, (data: { updateOpenTables: Table[] }) => {
      setTables(data.updateOpenTables)
    })

    const tables = ref<Table[]>([])

    const getTables = computed(() => tables.value)

    const isLoading = computed(() => loading)

    const setTables = (newTables: Table[]) => {
      tables.value = newTables
    }

    const { mutate: createMyTableMutate } = useMutation<CreateMyRoomResult>(createMyTableMutation)
    const { mutate: updateMyTableMutate } = useMutation<UpdateMyRoomResult>(updateMyTableMutation)
    const { mutate: joinMyTableMutate } = useMutation<JoinMyTableResult>(joinMyTableMutation)

    const createMyTable = async (name: string, isPublic: boolean) => {
      const result = await createMyTableMutate({ name, isPublic })
      if (result?.data?.createMyRoom) {
        myTable.value = result.data.createMyRoom
      }
      return result?.data?.createMyRoom
    }

    const updateMyTable = async (name: string, isPublic: boolean) => {
      const result = await updateMyTableMutate({ name, isPublic })
      if (result?.data?.updateMyRoom) {
        myTable.value = result.data.updateMyRoom
      }
      return result?.data?.updateMyRoom
    }

    const updateMyTableUsers = async (userIds: number[]) => {
      if (!myTable.value) return null
      const result = await updateMyTableMutate({
        name: myTable.value.name,
        isPublic: myTable.value.public,
        userIds,
      })
      if (result?.data?.updateMyRoom) {
        myTable.value = result.data.updateMyRoom
      }
      return result?.data?.updateMyRoom
    }

    const joinMyTable = async (): Promise<number | undefined> => {
      const result = await joinMyTableMutate()
      return result?.data?.joinMyTable
    }

    const existsMyTable = computed(() => myTable.value !== null)

    return {
      tables,
      setTables,
      getTables,
      isLoading,
      createMyTable,
      updateMyTable,
      updateMyTableUsers,
      joinMyTable,
      existsMyTable,
      defaultMyTableName: name,
    }
  },
  {
    persist: true,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTablesStore, import.meta.hot))
}
