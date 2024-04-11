import { getContextToken } from './context'

describe('context', () => {
  describe('getContextToken', () => {
    describe('with authorization', () => {
      it('returns the token', () => {
        expect(getContextToken('Bearer token')).toBe('token')
      })
    })

    describe('without authorization', () => {
      it('returns undefined', () => {
        expect(getContextToken(undefined)).toBe(undefined)
      })
    })
  })
})
