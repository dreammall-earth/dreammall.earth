import { jwtVerify, errors } from 'jose'

import logger from '#src/logger'
import { prisma, PrismaClientValidationError } from '#src/prisma'
import { deleteAll } from '#test/helpers'

import { context } from './context'

import type { PrismaClient } from '#src/prisma'
import type { CustomJwtPayload } from './context'

jest.mock('jose')

const token = 'foobar'

describe('context', () => {
  beforeEach(async () => {
    await deleteAll()
    jest.clearAllMocks()
  })

  describe('if the JWT is invalid', () => {
    beforeEach(() => {
      jest
        .mocked(jwtVerify<CustomJwtPayload>)
        .mockRejectedValue(new errors.JWTExpired('"exp" claim timestamp check failed', {}))
    })

    it('returns `null` for `contextValue.user`', async () => {
      await expect(context({ prisma })(token)).resolves.toMatchObject({
        user: null,
      })
    })
  })

  describe('if the JWT can be verified', () => {
    beforeEach(() => {
      const jwtVerifyPayload = {
        key: { type: 'whatever' },
        payload: { pk: 21, nickname: 'nickname', name: 'name' },
        protectedHeader: { alg: 'RS256' },
      } satisfies Awaited<ReturnType<typeof jwtVerify>>
      jest.mocked(jwtVerify<CustomJwtPayload>).mockResolvedValue(jwtVerifyPayload)
    })

    it('creates and returns a new user in `contextValue.user`', async () => {
      await expect(context({ prisma })(token)).resolves.toMatchObject({
        user: {
          username: 'nickname',
          name: 'name',
        },
      })
    })

    describe('if the user exists', () => {
      const setup = async () => {
        await prisma.user.create({
          data: {
            pk: 21,
            id: 21,
            username: 'nickname',
            name: 'Some Name',
            referenceId: 'ABCDEFGH',
          },
        })
      }

      it('returns the found user for `contextValue.user`', async () => {
        await setup()
        await expect(context({ prisma })(token)).resolves.toMatchObject({
          user: {
            id: 21,
            username: 'nickname',
            name: 'Some Name',
            referenceId: 'ABCDEFGH',
          },
        })
      })
    })

    describe('if prisma client throws an error, e.g. because of pending migrations', () => {
      it('rejects with a proper error', async () => {
        const prisma = {
          user: { findUnique: jest.fn().mockRejectedValue('Ouch!') },
        } as unknown as PrismaClient
        await expect(context({ prisma })(token)).rejects.toBe('Ouch!')
      })
    })

    describe('but if the JWT does not contain the expected scopes (e.g. because we forget to maintain our authentik on the vServer deployment)', () => {
      beforeEach(() => {
        const brokenPayload = {
          key: { type: 'whatever' },
          payload: { nickname: 'nickname', name: 'name' },
          protectedHeader: { alg: 'RS256' },
        } satisfies Awaited<ReturnType<typeof jwtVerify<{ nickname: string; name: string }>>>
        jest.mocked(jwtVerify<{ nickname: string; name: string }>).mockResolvedValue(brokenPayload)
      })

      it('crashes quite dramatically', async () => {
        const silencedLogger = jest.spyOn(logger, 'error')
        silencedLogger.mockImplementation(() => undefined)
        await expect(context({ prisma })(token)).rejects.toThrow(PrismaClientValidationError)
        silencedLogger.mockRestore()
        // TODO: make sure we don't silence logger.error permanently by accident
        // logger.error('See me on the console!')
      })
    })
  })
})
