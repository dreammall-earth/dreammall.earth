import { prisma } from '#src/prisma'
import { deleteAll } from '#test/helpers'

import { findOrCreateUser } from './findOrCreateUser'

describe('findOrCreateUser', () => {
  beforeEach(async () => {
    await deleteAll()
  })

  const nickname = 'mockedUser'
  const name = 'User'
  const pk = 11

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
      await findOrCreateUser({ prisma })({ pk, nickname, name })
    })

    it('has the user in database', async () => {
      await expect(prisma.user.findMany()).resolves.toHaveLength(1)
    })

    it('has the same user in database', async () => {
      await findOrCreateUser({ prisma })({ pk, nickname, name })
      await expect(prisma.user.findMany()).resolves.toHaveLength(1)
    })
  })
})
