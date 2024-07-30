import { useQuery, useSubscription } from '@vue/apollo-composable'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

import { openTablesQuery } from '#src/graphql/queries/openTablesQuery'
import { useAuthStore } from '#stores/authStore'
import { updateOpenTablesSubscription } from '#subscriptions/updateOpenTablesSubscription'

type Attendee = {
  fullName: string
}

export type Table = {
  meetingID: string
  meetingName: string
  startTime: string
  participantCount: number
  attendees: Attendee[]
  joinLink: string
}

export const useTablesStore = defineStore(
  'tables',
  () => {
    const authStore = useAuthStore()

    const name = authStore.user?.profile.name

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

    return {
      tables,
      setTables,
      getTables,
      isLoading,
    }
  },
  {
    persist: true,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTablesStore, import.meta.hot))
}
