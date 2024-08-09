import { prisma } from '#src/prisma'

import { findOrCreateUser } from './findOrCreateUser'

describe('findOrCreateUser', () => {
  const nickname = 'mockedUser'
  const name = 'User'
  describe('first call', () => {
    let userId: number

    it('creates user in database', async () => {
      await findOrCreateUser({ nickname, name })
      const result = await prisma.user.findMany()
      userId = result[0].id
      expect(result).toHaveLength(1)
      expect(result).toEqual([
        {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: expect.any(Number),
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
    it('has the user in database', async () => {
      await expect(prisma.user.findMany()).resolves.toHaveLength(1)
    })

    it('has the same user in database', async () => {
      await findOrCreateUser({ nickname, name })
      await expect(prisma.user.findMany()).resolves.toHaveLength(1)
    })
  })
})
