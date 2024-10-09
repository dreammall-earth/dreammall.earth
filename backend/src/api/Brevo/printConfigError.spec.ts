import { createMockConfig } from '#test/mockConfig'
import { createMockLogger } from '#test/mockLogger'

import { printConfigError } from './printConfigError'

const logger = createMockLogger()

describe('printConfigError', () => {
  beforeEach(jest.clearAllMocks)

  describe('with NODE_ENV = test', () => {
    it('return undefined', () => {
      const config = createMockConfig()
      config.NODE_ENV = 'test'
      expect(printConfigError({ logger, config })('test messsage')).toBeUndefined()
    })
  })

  describe('with NODE_ENV = production', () => {
    it('throws an error', () => {
      const config = createMockConfig()
      config.NODE_ENV = 'production'
      expect(() => printConfigError({ logger, config })('test message')).toThrow(
        new Error('test message'),
      )
    })
  })

  describe('with NODE_ENV = any other', () => {
    it('logs a warning', () => {
      const config = createMockConfig()
      config.NODE_ENV = 'any other'
      printConfigError({ logger, config })('test message')
      expect(logger.warn).toHaveBeenCalledWith('test message')
    })
  })
})
