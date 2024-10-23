import { CONFIG } from '#config/config'
import { prisma } from '#src/prisma'
import { deleteAll } from '#test/helpers'

import { findOrCreateUser } from './findOrCreateUser'

import type { UserWithProfile } from '#src/prisma'

describe('findOrCreateUser', () => {
  beforeEach(async () => {
    await deleteAll()
  })

  const nickname = 'mockedUser'
  const name = 'User'
  const pk = 11

  let user: UserWithProfile

  describe('first call', () => {
    it('creates user in database', async () => {
      await findOrCreateUser({ prisma })({ pk, nickname, name })
      const result = await prisma.user.findMany()
      expect(result).toHaveLength(1)
      expect(result).toEqual([
        {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: expect.any(Number),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          pk: expect.any(Number),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          referenceId: expect.any(String),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          createdAt: expect.any(Date),
          name: 'User',
          username: 'mockedUser',
          introduction: null,
          availability: null,
          meetingId: null,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          testphaseEndsAt: expect.any(Date),
        },
      ])
    })

    it('sets testphaseEndsAt correctly', async () => {
      const user = await findOrCreateUser({ prisma })({ pk, nickname, name })
      const createdAt = user.createdAt.getTime()
      expect(user.testphaseEndsAt).not.toBeNull()
      const dayInMilliseconds = 24 * 60 * 60 * 1000
      const testphaseEndsAt: number = user.testphaseEndsAt.getTime()
      expect(testphaseEndsAt).toBeLessThan(
        CONFIG.TESTPHASE_DURATION_DAYS * dayInMilliseconds + createdAt,
      )
      expect(testphaseEndsAt).toBeGreaterThan(
        (CONFIG.TESTPHASE_DURATION_DAYS - 1) * dayInMilliseconds + createdAt,
      )
    })

    it('creates CREATE USER event', async () => {
      await findOrCreateUser({ prisma })({ pk, nickname, name })
      const users = await prisma.user.findMany()
      const [{ id: userId }] = users
      const result = await prisma.event.findMany()
      expect(result).toHaveLength(1)
      expect(result).toEqual([
        expect.objectContaining({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: expect.any(Number),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          createdAt: expect.any(Date),
          type: 'CREATE_USER',
          involvedUserId: userId,
        }),
      ])
    })

    describe('second call', () => {
      beforeEach(async () => {
        user = await findOrCreateUser({ prisma })({ pk, nickname, name })
      })

      it('has the user in database', async () => {
        await expect(prisma.user.findMany()).resolves.toHaveLength(1)
      })

      it('has the same user in database', async () => {
        await expect(findOrCreateUser({ prisma })({ pk, nickname, name })).resolves.toEqual(user)
      })
    })
  })
})
