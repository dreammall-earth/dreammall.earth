import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect } from 'vitest'

import { useActiveRoomStore } from './activeRoomStore'

describe('Active Room Store', () => {
  setActivePinia(createPinia())
  const activeRoomStore = useActiveRoomStore()

  describe('defaults', () => {
    it('has defaults set correctly', () => {
      expect(activeRoomStore.activeRoom).toBeNull()
      expect(activeRoomStore.getActiveRoom).toBeNull()
    })
  })

  describe('set active room action', () => {
    it('updates the store', () => {
      activeRoomStore.setActiveRoom('https://link-to-my.room')
      expect(activeRoomStore.activeRoom).toBe('https://link-to-my.room')
    })
  })
})
