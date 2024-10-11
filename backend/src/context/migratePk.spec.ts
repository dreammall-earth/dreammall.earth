import { prisma } from '#src/prisma'

import { migratePk } from './migratePk'

describe('migratePk', () => {
  describe('given a legacy user with missing `pk` attribute', () => {
    const setup = async () => {
      await prisma.user.create({
        data: {
          pk: undefined,
          id: 47,
          username: 'findme',
          name: 'Does not matter',
          referenceId: 'ABCDEFGH',
        },
      })
    }

    const decodedPayload = {
      pk: 123,
      nickname: 'findme',
      name: 'Does not matter',
    }

    it('sets the `pk` attribute', async () => {
      await setup()
      await migratePk({ prisma })(decodedPayload)
      await expect(prisma.user.count()).resolves.toBe(1)
      await expect(prisma.user.findFirst()).resolves.toMatchObject({
        pk: 123,
        username: 'findme',
        name: 'Does not matter',
      })
    })

    it('returns the updated user', async () => {
      await expect(migratePk({ prisma })(decodedPayload)).resolves.toMatchObject({
        pk: 123,
        username: 'findme',
        name: 'Does not matter',
      })
    })
  })
})
