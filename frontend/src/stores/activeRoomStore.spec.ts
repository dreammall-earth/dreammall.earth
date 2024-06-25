import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { useActiveRoomStore } from './activeRoomStore'

describe('Active Room Store', () => {
  setActivePinia(createPinia())
  const activeRoomStore = useActiveRoomStore()

  describe('defaults', () => {
    it('has defaults set correctly', () => {
      expect(activeRoomStore.activeRoom).toBe(null)
    })
  })

  describe('set active room action', () => {
    it('updates the store', () => {
      activeRoomStore.setActiveRoom( 'https://link-to-my.room')
      expect(activeRoomStore.activeRoom).toBe('https://link-to-my.room')
    })
  })
})
