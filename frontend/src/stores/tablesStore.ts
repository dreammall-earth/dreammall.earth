import { useQuery, useSubscription } from '@vue/apollo-composable'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

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

export const useTablesStore = defineStore(
  'tables',
  () => {
    const userStore = useUserStore()

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

    const { result: updateOpenTablesSubscriptionResult, error: updateOpenTablesSubscriptionError } = useSubscription(
      updateOpenTablesSubscription,
      () => ({ username: userStore.getCurrentUser?.username || 'Unknown User' }),
      { fetchPolicy: 'no-cache' },
    )

    watch(updateOpenTablesSubscriptionResult, (data: { updateOpenTables: Table[] }) => {
      console.log('updateOpenTablesSubscriptionResult', data)
      setTables(data.updateOpenTables)
    })

    watch(updateOpenTablesSubscriptionError, () => {
      console.log(updateOpenTablesSubscriptionError)
    })

    const tables = ref<Table[]>([])

    const getTables = computed(() => tables.value)

    const isLoading = computed(() => loading)

    const setTables = (newTables: Table[]) => {
      tables.value = newTables
    }

    return {
      tables,
      setTables,
      getTables,
      isLoading,
    }
  },
  {
    persist: false,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTablesStore, import.meta.hot))
}
