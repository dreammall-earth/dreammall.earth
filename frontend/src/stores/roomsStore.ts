import { useQuery } from '@vue/apollo-composable'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

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

export const useRoomsStore = defineStore(
  'rooms',
  () => {
    const { result: openRoomsQueryResult, loading } = useQuery(
      openRoomsQuery,
      {},
      {
        prefetch: false,
        fetchPolicy: 'no-cache',
      },
    )

    watch(openRoomsQueryResult, (data: { openRooms: Room[] }) => {
      setRooms(data.openRooms)
    })

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
  },
  { persist: true },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRoomsStore, import.meta.hot))
}
