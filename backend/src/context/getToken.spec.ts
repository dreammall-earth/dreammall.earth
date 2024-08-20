import { getToken } from './getToken'

describe('getToken', () => {
  describe('with authorization', () => {
    it('returns the token', () => {
      expect(getToken('Bearer token')).toBe('token')
    })
  })

  describe('without authorization', () => {
    it('returns undefined', () => {
      expect(getToken(undefined)).toBeUndefined()
    })
  })
})
