/* eslint-disable n/no-process-env */
import { printConfigError } from './printConfigError'

describe('printConfigError', () => {
  describe('with NODE_ENV = test', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test'
    })

    it('return undefined', () => {
      expect(printConfigError('test messsage')).toEqual(undefined)
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
      global.console.warn = jest.fn()
      printConfigError('test message')
    })

    it('throws an error', () => {
      // eslint-disable-next-line no-console
      expect(console.warn).toHaveBeenCalledWith('test message')
    })
  })
})
