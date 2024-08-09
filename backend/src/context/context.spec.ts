import { jwtVerify } from 'jose'

import { context } from './context'
import { findOrCreateUser } from './findOrCreateUser'

import type { CustomJwtPayload } from './context'

jest.mock('./findOrCreateUser')
jest.mock('jose')

const mockedFindOrCreateUser = jest.mocked(findOrCreateUser)
const mockedJwtVerify = jest.mocked(jwtVerify<CustomJwtPayload>)

describe('context', () => {
  describe('if prisma client throws an error, e.g. because of pending migrations', () => {
    beforeEach(() => {
      mockedFindOrCreateUser.mockRejectedValue('Ouch!')
      const jwtVerifyPayload = { payload: { nickname: 'nickname', name: 'name' } }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-explicit-any
      mockedJwtVerify.mockResolvedValue(jwtVerifyPayload as any)
    })

    it('resolves to "INTERNAL_SERVER_ERROR" instead of "UNAUTHENTICATED"', async () => {
      const contextArgs = [{ req: { headers: { authorization: 'Bearer foobar' } } }] as Parameters<
        typeof context
      >
      await expect(context(...contextArgs)).rejects.toBe('Ouch!')
    })
  })
})
