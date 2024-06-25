import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

export const useActiveRoomStore = defineStore('activeRoom', () => {
  const activeRoom = ref<string | null>(null)

  const setActiveRoom = (room: string | null) => {
    activeRoom.value = room
  }

  return {
    activeRoom,
    setActiveRoom,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useActiveRoomStore, import.meta.hot))
}
