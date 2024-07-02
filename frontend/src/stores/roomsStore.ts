import { useQuery } from '@vue/apollo-composable'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

import GlobalErrorHandler from '#plugins/globalErrorHandler'
import { openRoomsQuery } from '#src/graphql/queries/openRoomsQuery'

type Attendee = {
  fullName: string
}

export type Room = {
  meetingID: string
  meetingName: string
  startTime: string
  participantCount: number
  attendees: Attendee[]
  joinLink: string
}

export const useRoomsStore = defineStore('rooms', () => {
  const {
    result: openRoomsQueryResult,
    refetch: openRoomsQueryRefetch,
    loading,
  } = useQuery(
    openRoomsQuery,
    {},
    {
      prefetch: false,
      fetchPolicy: 'no-cache',
    },
  )

  const refetchRooms = async () => {
    try {
      const test = await openRoomsQueryRefetch()
      console.log('test', test)
      console.log('refetchRooms', openRoomsQueryResult.value)
      if (openRoomsQueryResult.value) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        setRooms(openRoomsQueryResult.value.openRooms)
      }
    } catch (error) {
      GlobalErrorHandler.error('Error refetching open rooms!', error)
    }
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(refetchRooms, 60 * 1000)
  }

  void refetchRooms()

  const rooms = ref<Room[]>([])

  const getRooms = computed(() => rooms.value)

  const isLoading = computed(() => loading)

  const setRooms = (newRooms: Room[]) => {
    rooms.value = newRooms
  }

  return {
    rooms,
    setRooms,
    getRooms,
    isLoading,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRoomsStore, import.meta.hot))
}
