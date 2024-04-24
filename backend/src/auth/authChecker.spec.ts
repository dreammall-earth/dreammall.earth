import { ApolloServer } from '@apollo/server'

import { prisma } from '#src/prisma'
import { createTestServer } from '#src/server/server'

let testServer: ApolloServer

beforeAll(async () => {
  testServer = await createTestServer()
})

// uses getRoom query
describe('authChecker', () => {
  describe('no token in context', () => {
    it('returns access denied error', async () => {
      await expect(
        testServer.executeOperation({
          query: 'query { getRoom }',
        }),
      ).resolves.toMatchObject({
        body: {
          kind: 'single',
          singleResult: {
            data: null,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            errors: expect.arrayContaining([
              expect.objectContaining({
                message: 'Access denied! You need to be authenticated to perform this action!',
              }),
            ]),
          },
        },
      })
    })
  })

  describe('valid token in context', () => {
    it('has no user in database', async () => {
      expect(await prisma.user.findMany()).toHaveLength(0)
    })

    describe('first call', () => {
      it('creates user in database', async () => {
        await testServer.executeOperation(
          {
            query: 'query { getRoom }',
          },
          {
            contextValue: {
              token: 'token',
            },
          },
        )
        const result = await prisma.user.findMany()
        expect(result).toHaveLength(1)
        expect(result).toEqual([
          {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: expect.any(Number),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            createdAt: expect.any(Date),
            name: 'User',
            username: 'mockedUser',
          },
        ])
      })
    })

    describe('second call', () => {
      it('has the user in database', async () => {
        expect(await prisma.user.findMany()).toHaveLength(1)
      })

      it('has the same user in database', async () => {
        await testServer.executeOperation(
          {
            query: 'query { getRoom }',
          },
          {
            contextValue: {
              token: 'token',
            },
          },
        )
        expect(await prisma.user.findMany()).toHaveLength(1)
      })
    })
  })
})
