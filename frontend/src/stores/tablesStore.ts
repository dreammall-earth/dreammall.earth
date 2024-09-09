import { useMutation, useQuery, useSubscription } from '@vue/apollo-composable'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

import { createMyTableMutation } from '#mutations/createMyTableMutation'
import { joinMyTableMutation } from '#mutations/joinMyTableMutation'
import { updateMyTableMutation } from '#mutations/updateMyTableMutation'
import { openTablesQuery } from '#src/graphql/queries/openTablesQuery'
import { useUserStore } from '#stores/userStore'
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

type CreateMyTableResult = {
  createMyTable: MyTable
}

type UpdateMyTableResult = {
  updateMyTable: MyTable
}

type JoinMyTableResult = {
  joinMyTable: number
}

export const useTablesStore = defineStore(
  'tables',
  () => {
    const userStore = useUserStore()
    const { getMyTable: myTable, currentUser } = storeToRefs(userStore)

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

    const {
      result: updateOpenTablesSubscriptionResult /* , error: updateOpenTablesSubscriptionError */,
    } = useSubscription(
      updateOpenTablesSubscription,
      () => ({ username: userStore.getCurrentUser?.username || 'Unknown User' }),
      { fetchPolicy: 'no-cache' },
    )

    watch(updateOpenTablesSubscriptionResult, (data: { updateOpenTables: Table[] }) => {
      setTables(data.updateOpenTables)
    })

    /*
    watch(updateOpenTablesSubscriptionError, () => {
      console.log(updateOpenTablesSubscriptionError)
    })
    */

    const tables = ref<Table[]>([])

    const getTables = computed(() => tables.value)

    const isLoading = computed(() => loading)

    const setTables = (newTables: Table[]) => {
      tables.value = newTables
    }

    const { mutate: createMyTableMutate } = useMutation<CreateMyTableResult>(createMyTableMutation)
    const { mutate: updateMyTableMutate } = useMutation<UpdateMyTableResult>(updateMyTableMutation)
    const { mutate: joinMyTableMutate } = useMutation<JoinMyTableResult>(joinMyTableMutation)

    const createMyTable = async (name: string, isPublic: boolean, userIds: number[]) => {
      const result = await createMyTableMutate({ name, isPublic, userIds })
      if (result?.data?.createMyTable) {
        userStore.setMyTable(result.data.createMyTable)
      }
      return result?.data?.createMyTable
    }

    const updateMyTable = async (name: string, isPublic: boolean) => {
      const result = await updateMyTableMutate({ name, isPublic })
      if (result?.data?.updateMyTable) {
        userStore.setMyTable(result.data.updateMyTable)
      }
      return result?.data?.updateMyTable
    }

    const updateMyTableUsers = async (userIds: number[]) => {
      if (!myTable.value) return null
      const result = await updateMyTableMutate({
        name: myTable.value.name,
        isPublic: myTable.value.public,
        userIds,
      })
      if (result?.data?.updateMyTable) {
        userStore.setMyTable(result.data.updateMyTable)
      }
      return result?.data?.updateMyTable
    }

    const joinMyTable = async (): Promise<number | undefined> => {
      const result = await joinMyTableMutate()
      return result?.data?.joinMyTable
    }

    const existsMyTable = computed(() => myTable.value !== null)
    const defaultMyTableName = computed(() => currentUser.value?.name ?? '')
    const isTableChangeable = (id: number): boolean => {
      return existsMyTable.value && myTable.value?.id === id
    }

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
      defaultMyTableName,
      isTableChangeable,
    }
  },
  {
    persist: false,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTablesStore, import.meta.hot))
}
