import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useActiveRoomStore = defineStore('activeRoom', () => {
  const activeRoom = ref<string | null>(null)

  const getActiveRoom = computed(() => activeRoom.value)

  const setActiveRoom = (room: string | null) => {
    // console.log('setActiveRoom', room)
    activeRoom.value = room
  }

  return {
    activeRoom,
    setActiveRoom,
    getActiveRoom,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useActiveRoomStore, import.meta.hot))
}
