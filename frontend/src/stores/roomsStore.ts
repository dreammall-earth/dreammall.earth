import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

type Room = {
    @Field()
    meetingID: string
  
    @Field()
    meetingName: string
  

    startTime: number

    participantCount: number
  
    attendees: Attendee[]
  
    joinLink: string
}

export const useRoomsStore = defineStore('rooms', () => {
  const rooms = ref<Room[]>([])

  const getRooms = computed(() => rooms.value)

  const setRooms = (newRooms: Rooms[]) => {
    rooms.value = newRooms
  }

  return {
    rooms,
    setRooms,
    getRooms,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRoomsStore, import.meta.hot))
}
