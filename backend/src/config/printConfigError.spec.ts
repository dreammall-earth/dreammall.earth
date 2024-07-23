/* eslint-disable n/no-process-env */
import logger from '#src/logger'

import { printConfigError } from './printConfigError'

jest.mock('#src/logger', () => {
  return {
    warn: jest.fn(),
  }
})

describe('printConfigError', () => {
  describe('with NODE_ENV = test', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test'
    })

    it('return undefined', () => {
      expect(printConfigError('test messsage')).toStrictEqual(undefined)
    })
  })

  describe('with NODE_ENV = production', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production'
    })

    it('throws an error', () => {
      expect(() => printConfigError('test message')).toThrow(new Error('test message'))
    })
  })

  describe('with NODE_ENV = any other', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'any other'
      printConfigError('test message')
    })

    it('logs a warning', () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(logger.warn).toHaveBeenCalledWith('test message')
    })
  })
})
