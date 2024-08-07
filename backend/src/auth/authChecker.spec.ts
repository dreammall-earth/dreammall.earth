import { ApolloServer } from '@apollo/server'

import { prisma } from '#src/prisma'
import { createTestServer } from '#src/server/server'

import type { Context } from '#src/server/context'

// eslint-disable-next-line jest/no-untyped-mock-factory
jest.mock('axios', () => {
  return {
    create: jest.fn().mockImplementation(() => {
      return {
        interceptors: {
          request: {
            use: jest.fn(),
          },
        },
        post: jest.fn().mockImplementation(() => ({
          data: {},
        })),
        get: jest.fn().mockImplementation(() => ({
          data: {},
        })),
      }
    }),
  }
})

let testServer: ApolloServer<Context>

// uses joinMyTable query
describe('authChecker', () => {
  beforeAll(async () => {
    testServer = await createTestServer()
  })

  describe('no token in context', () => {
    it('returns access denied error', async () => {
      await expect(
        testServer.executeOperation(
          {
            query: 'mutation { joinMyTable }',
          },
          { contextValue: { dataSources: { prisma } } },
        ),
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
      await expect(prisma.user.findMany()).resolves.toHaveLength(0)
    })

    describe('if prisma client throws an error, e.g. because of pending migrations', () => {
      const failingPrisma = {
        user: { findUnique: jest.fn(prisma.user.findUnique).mockRejectedValue('Ouch!') },
      } as unknown as typeof prisma

      it('resolves to "INTERNAL_SERVER_ERROR" instead of "UNAUTHENTICATED"', async () => {
        await expect(
          testServer.executeOperation(
            { query: 'mutation { joinMyTable }' },
            { contextValue: { token: 'token', dataSources: { prisma: failingPrisma } } },
          ),
        ).resolves.toEqual({
          http: expect.anything(), // eslint-disable-line @typescript-eslint/no-unsafe-assignment
          body: {
            kind: 'single',
            singleResult: {
              data: null,
              errors: [
                {
                  extensions: { code: 'INTERNAL_SERVER_ERROR' },
                  locations: expect.anything(), // eslint-disable-line @typescript-eslint/no-unsafe-assignment
                  message: 'Unexpected error value: "Ouch!"',
                  path: ['joinMyTable'],
                },
              ],
            },
          },
        })
      })
    })

    describe('first call', () => {
      let userId: number

      it('creates user in database', async () => {
        await testServer.executeOperation(
          {
            query: 'mutation { joinMyTable }',
          },
          {
            contextValue: {
              token: 'token',
              dataSources: { prisma },
            },
          },
        )
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
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            meetingId: expect.any(Number),
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
        await testServer.executeOperation(
          {
            query: 'mutation { joinMyTable }',
          },
          {
            contextValue: {
              token: 'token',
              dataSources: { prisma },
            },
          },
        )
        await expect(prisma.user.findMany()).resolves.toHaveLength(1)
      })
    })
  })
})
