import { useMutation, useQuery, useSubscription } from '@vue/apollo-composable'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

import { createMyTableMutation } from '#mutations/createMyTableMutation'
import { createTableMutation } from '#mutations/createTableMutation'
import { deleteTableMutation } from '#mutations/deleteTableMutation'
import { joinMyTableMutation } from '#mutations/joinMyTableMutation'
import { updateMyTableMutation } from '#mutations/updateMyTableMutation'
import { openTablesQuery } from '#src/graphql/queries/openTablesQuery'
import { tablesQuery } from '#src/graphql/queries/tablesQuery'
import { useUserStore } from '#stores/userStore'
import { updateOpenTablesSubscription } from '#subscriptions/updateOpenTablesSubscription'

type Attendee = {
  fullName: string
}

export type OpenTable = {
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

export type Table = {
  id: number
  name: string
  public: boolean
  users: UserInTable[]
}

type CreateMyTableResult = {
  createMyTable: Table
}

type UpdateMyTableResult = {
  updateMyTable: Table
}

type JoinMyTableResult = {
  joinMyTable: number
}

type CreateTableResult = {
  createTable: Table
}

type DeleteTableResult = {
  deleteTable: boolean
}

export const useTablesStore = defineStore(
  'tables',
  () => {
    const userStore = useUserStore()
    const { getMyTable: myTable, currentUser } = storeToRefs(userStore)

    const { result: openTablesQueryResult, loading: isLoadingOpenTables } = useQuery(
      openTablesQuery,
      {},
      {
        prefetch: false,
        fetchPolicy: 'no-cache',
      },
    )

    watch(openTablesQueryResult, (data: { openTables: OpenTable[] }) => {
      setOpenTables(data.openTables)
    })

    const { result: tablesQueryResult, loading: isLoadingTables } = useQuery(
      tablesQuery,
      {},
      {
        prefetch: false,
        fetchPolicy: 'no-cache',
      },
    )

    watch(tablesQueryResult, (data: { tables: Table[] }) => {
      setTables(data.tables)
    })

    const {
      result: updateOpenTablesSubscriptionResult /* , error: updateOpenTablesSubscriptionError */,
    } = useSubscription(
      updateOpenTablesSubscription,
      () => ({ username: userStore.getCurrentUser?.username || 'Unknown User' }),
      { fetchPolicy: 'no-cache' },
    )

    watch(updateOpenTablesSubscriptionResult, (data: { updateOpenTables: OpenTable[] }) => {
      setOpenTables(data.updateOpenTables)
    })

    /*
    watch(updateOpenTablesSubscriptionError, () => {
      console.log(updateOpenTablesSubscriptionError)
    })
    */

    const openTables = ref<OpenTable[]>([])

    const getOpenTables = computed(() => openTables.value)

    const setOpenTables = (newTables: OpenTable[]) => {
      openTables.value = newTables
    }

    const tables = ref<Table[]>([])

    const getTables = computed(() => tables.value)

    const setTables = (newTables: Table[]) => {
      tables.value = newTables
    }

    const { mutate: createMyTableMutate } = useMutation<CreateMyTableResult>(createMyTableMutation)
    const { mutate: updateMyTableMutate } = useMutation<UpdateMyTableResult>(updateMyTableMutation)
    const { mutate: joinMyTableMutate } = useMutation<JoinMyTableResult>(joinMyTableMutation)

    const { mutate: createTableMutate } = useMutation<CreateTableResult>(createTableMutation)
    const { mutate: deleteTableMutate } = useMutation<DeleteTableResult>(deleteTableMutation)

    const createTable = async (name: string, isPublic: boolean, userIds: number[]) => {
      const result = await createTableMutate({ name, isPublic, userIds })
      if (result?.data?.createTable) {
        setTables([...tables.value, result.data.createTable])
      }
      return result?.data?.createTable
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updateTable = async (_tableId: number, _name: string, _isPublic: boolean) => {
      // TODO: Implement
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updateTableModerators = async (_tableId: number, _userIds: number[]) => {
      // TODO: Implement
    }

    const deleteTable = async (tableId: number) => {
      const result = await deleteTableMutate({ tableId })

      if (result?.data?.deleteTable) {
        setTables(tables.value.filter((table) => table.id !== tableId))
      }

      return result?.data?.deleteTable
    }

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
    const isTableChangeable = (id: number): boolean => myTable.value?.id === id

    return {
      openTables,
      setOpenTables,
      getOpenTables,
      isLoadingOpenTables,
      getTables,
      setTables,
      isLoadingTables,
      createMyTable,
      updateMyTable,
      updateMyTableUsers,
      createTable,
      updateTable,
      updateTableModerators,
      deleteTable,
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
