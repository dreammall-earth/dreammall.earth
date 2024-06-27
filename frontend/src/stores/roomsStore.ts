import { useQuery } from '@vue/apollo-composable'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { openRoomsQuery } from '#src/graphql/queries/openRoomsQuery'

type Attendee = {
  fullName: string
}

export type Room = {
  meetingID: string
  meetingName: string
  startTime: number
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
    await openRoomsQueryRefetch()
    if (openRoomsQueryResult.value) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      rooms.value = openRoomsQueryResult.value.openRooms
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
