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

  describe('TESTPHASE is undefined', () => {
    beforeEach(() => {
      CONFIG.TESTPHASE_DEFAULT = undefined
      CONFIG.TESTPHASE_DURATION_DAYS = undefined
    })

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
            testphaseEndsAt: null,
          },
        ])
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

    describe('second call with TESTPHASE_DEFAULT set', () => {
      beforeEach(async () => {
        user = await findOrCreateUser({ prisma })({ pk, nickname, name })
      })

      it('adds the default value for testphase ends at', async () => {
        CONFIG.TESTPHASE_DEFAULT = new Date()
        await expect(findOrCreateUser({ prisma })({ pk, nickname, name })).resolves.toEqual({
          ...user,
          testphaseEndsAt: CONFIG.TESTPHASE_DEFAULT,
        })
      })
    })
  })

  describe('TESTPHASE is correctly defined', () => {
    it('adds the date when the testphase ends', async () => {
      CONFIG.TESTPHASE_DURATION_DAYS = 30
      user = await findOrCreateUser({ prisma })({ pk, nickname, name })
      const createdAt = user?.createdAt.getTime()
      expect(user?.testphaseEndsAt).not.toBeNull()
      const dayInMilliseconds = 24 * 60 * 60 * 1000
      // stupid typescript: if testphaseEndsAt is null,
      // the test before fails, so it is not null at this point
      // eslint-disable-next-line jest/no-conditional-in-test
      const testphaseEndsAt: number = user?.testphaseEndsAt
        ? user?.testphaseEndsAt.getTime()
        : createdAt + (CONFIG.TESTPHASE_DURATION_DAYS + 1) * dayInMilliseconds
      expect(testphaseEndsAt).toBeLessThan(
        CONFIG.TESTPHASE_DURATION_DAYS * dayInMilliseconds + createdAt,
      )
      expect(testphaseEndsAt).toBeGreaterThan(
        (CONFIG.TESTPHASE_DURATION_DAYS - 1) * dayInMilliseconds + createdAt,
      )
    })

    describe('second call', () => {
      beforeEach(async () => {
        CONFIG.TESTPHASE_DURATION_DAYS = 30
        user = await findOrCreateUser({ prisma })({ pk, nickname, name })
      })

      it('does not alter the user in the database', async () => {
        await expect(findOrCreateUser({ prisma })({ pk, nickname, name })).resolves.toEqual(user)
      })
    })
  })
})
