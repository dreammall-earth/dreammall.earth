import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect } from 'vitest'

import { useActiveTableStore } from './activeTableStore'

describe('Active Table Store', () => {
  setActivePinia(createPinia())
  const activeTableStore = useActiveTableStore()

  describe('defaults', () => {
    it('has defaults set correctly', () => {
      expect(activeTableStore.activeTable).toBeNull()
      expect(activeTableStore.getActiveTable).toBeNull()
    })
  })

  describe('set active table action', () => {
    it('updates the store', () => {
      activeTableStore.setActiveTable('https://link-to-my.table')
      expect(activeTableStore.activeTable).toBe('https://link-to-my.table')
    })
  })
})
