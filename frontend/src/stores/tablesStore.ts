import { useMutation, useQuery, useSubscription } from '@vue/apollo-composable'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { computed, reactive, ref, watch } from 'vue'

import { createMyTableMutation } from '#mutations/createMyTableMutation'
import { createTableMutation } from '#mutations/createTableMutation'
import { deleteTableMutation } from '#mutations/deleteTableMutation'
import { joinMyTableMutation } from '#mutations/joinMyTableMutation'
import { updateMyTableMutation } from '#mutations/updateMyTableMutation'
import { updateTableMutation } from '#mutations/updateTableMutation'
import { tablesQuery } from '#queries/tablesQuery'
import { projectTablesQuery } from '#src/graphql/queries/projectTablesQuery'
import { useUserStore } from '#stores/userStore'
import { inviteTableSubscription } from '#subscriptions/inviteTableSubscription'
import { updateOpenTablesSubscription } from '#subscriptions/updateOpenTablesSubscription'

type Attendee = {
  fullName: string
}

export type TableType = 'MALL_TALK' | 'PERMANENT' | 'PROJECT'

export type Table = {
  id: number
  type: TableType
  isModerator: boolean
  meetingID: string
  meetingName: string
  startTime: string
  participantCount: number
  attendees: Attendee[]
}

export type TableList = {
  mallTalkTables: Table[]
  permanentTables: Table[]
  projectTables: Table[]
}

export type UserInTable = {
  id: number
  role: 'VIEWER' | 'MODERATOR'
  name: string
  username: string
}

export type ProjectTable = {
  id: number
  name: string
  public: boolean
  users: UserInTable[]
}

type User = {
  id: number
  name: string
  username: string
}

type InvitedTable = {
  user: User
  table: Table
}

type CreateMyTableResult = {
  createMyTable: ProjectTable
}

type UpdateMyTableResult = {
  updateMyTable: ProjectTable
}

type UpdateTableResult = {
  updateTable: ProjectTable
}

type JoinMyTableResult = {
  joinMyTable: number
}

type CreateTableResult = {
  createTable: ProjectTable
}

type DeleteTableResult = {
  deleteTable: boolean
}

export const useTablesStore = defineStore(
  'tables',
  () => {
    const userStore = useUserStore()
    const { getMyTable: myTable, currentUser } = storeToRefs(userStore)

    const { result: tablesQueryResult, loading: isLoadingTables } = useQuery(
      tablesQuery,
      {},
      {
        prefetch: false,
        fetchPolicy: 'no-cache',
      },
    )

    watch(tablesQueryResult, (data: { tables: TableList }) => {
      setTables(data.tables)
    })

    const { result: projectTablesQueryResult, loading: isLoadingProjectTables } = useQuery(
      projectTablesQuery,
      {},
      {
        prefetch: false,
        fetchPolicy: 'no-cache',
      },
    )

    watch(projectTablesQueryResult, (data: { projectTables: ProjectTable[] }) => {
      setProjectTables(data.projectTables)
    })

    const {
      result: updateOpenTablesSubscriptionResult /* , error: updateOpenTablesSubscriptionError */,
    } = useSubscription(updateOpenTablesSubscription, () => ({}), { fetchPolicy: 'no-cache' })

    watch(updateOpenTablesSubscriptionResult, (data: { updateOpenTables: TableList }) => {
      setTables(data.updateOpenTables)
    })

    /*
    watch(updateOpenTablesSubscriptionError, () => {
      console.log(updateOpenTablesSubscriptionError)
    })
    */

    const { result: inviteTableSubscriptionResult } = useSubscription(
      inviteTableSubscription,
      () => ({}),
      { fetchPolicy: 'no-cache' },
    )

    watch(inviteTableSubscriptionResult, (data: { inviteTable: InvitedTable }) => {
      // eslint-disable-next-line no-console
      console.log('INVITE TABLE SUBSCRIPTION', data.inviteTable)
    })

    const tables = reactive<TableList>({
      mallTalkTables: [],
      permanentTables: [],
      projectTables: [],
    })

    const getTables = computed(() => tables)

    const setTables = (newTables: TableList) => {
      tables.mallTalkTables = newTables.mallTalkTables.map((table) => ({
        ...table,
        type: 'MALL_TALK',
      }))
      tables.permanentTables = newTables.permanentTables.map((table) => ({
        ...table,
        type: 'PERMANENT',
      }))
      tables.projectTables = newTables.projectTables.map((table) => ({
        ...table,
        type: 'PROJECT',
      }))
    }

    const projectTables = ref<ProjectTable[]>([])

    const getProjectTables = computed(() => projectTables.value)
    const setProjectTables = (newTables: ProjectTable[]) => {
      projectTables.value = newTables
    }

    const { mutate: createMyTableMutate } = useMutation<CreateMyTableResult>(createMyTableMutation)
    const { mutate: updateMyTableMutate } = useMutation<UpdateMyTableResult>(updateMyTableMutation)
    const { mutate: updateProjectTableMutate } = useMutation<UpdateTableResult>(updateTableMutation)
    const { mutate: joinMyTableMutate } = useMutation<JoinMyTableResult>(joinMyTableMutation)

    const { mutate: createTableMutate } = useMutation<CreateTableResult>(createTableMutation)
    const { mutate: deleteProjectTableMutate } = useMutation<DeleteTableResult>(deleteTableMutation)

    const createProjectTable = async (name: string, isPublic: boolean, userIds: number[]) => {
      const result = await createTableMutate({ name, isPublic, userIds })
      if (result?.data?.createTable) {
        setProjectTables([...projectTables.value, result.data.createTable])
      }
      return result?.data?.createTable
    }

    const updateProjectTable = async (tableId: number, name: string, isPublic: boolean) => {
      const result = await updateProjectTableMutate({ name, tableId, isPublic })
      if (result?.data?.updateTable) {
        setProjectTables([
          ...projectTables.value.filter((table) => table.id !== tableId),
          result.data.updateTable,
        ])
      }
      return result?.data?.updateTable
    }

    const updateProjectTableModerators = async (tableId: number, userIds: number[]) => {
      const result = await updateProjectTableMutate({ tableId, userIds })
      if (result?.data?.updateTable) {
        setProjectTables([
          ...projectTables.value.filter((table) => table.id !== tableId),
          result.data.updateTable,
        ])
      }
      return result?.data?.updateTable
    }

    const deleteProjectTable = async (tableId: number) => {
      const result = await deleteProjectTableMutate({ tableId })

      if (result?.data?.deleteTable) {
        setProjectTables(projectTables.value.filter((table) => table.id !== tableId))
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
    const getTableUri = (id: number): string => `/table/${id}`
    const getJoinTableUri = (id: number): string => `/join-table/${id}`
    const getJoinTableUrl = (id: number, baseUrl: string): string =>
      id ? new URL(getJoinTableUri(id), baseUrl).href : ''

    return {
      openTables: tables,
      setTables,
      getTables,
      isLoadingTables,
      getProjectTables,
      setProjectTables,
      isLoadingProjectTables,
      createMyTable,
      updateMyTable,
      updateMyTableUsers,
      createProjectTable,
      updateProjectTable,
      updateProjectTableModerators,
      deleteProjectTable,
      joinMyTable,
      existsMyTable,
      defaultMyTableName,
      isTableChangeable,
      getTableUri,
      getJoinTableUrl,
    }
  },
  {
    persist: false,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTablesStore, import.meta.hot))
}
