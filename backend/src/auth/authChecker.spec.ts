import { ApolloServer } from '@apollo/server'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios from 'axios'

import { prisma } from '#src/prisma'
import { createTestServer } from '#src/server/server'

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

let testServer: ApolloServer

// uses joinMyRoom query
describe('authChecker', () => {
  beforeAll(async () => {
    testServer = await createTestServer()
  })

  describe('no token in context', () => {
    it('returns access denied error', async () => {
      await expect(
        testServer.executeOperation({
          query: 'mutation { joinMyRoom }',
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
      await expect(prisma.user.findMany()).resolves.toHaveLength(0)
    })

    describe('first call', () => {
      let userId: number

      it('creates user in database', async () => {
        await testServer.executeOperation(
          {
            query: 'mutation { joinMyRoom }',
          },
          {
            contextValue: {
              token: 'token',
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
            query: 'mutation { joinMyRoom }',
          },
          {
            contextValue: {
              token: 'token',
            },
          },
        )
        await expect(prisma.user.findMany()).resolves.toHaveLength(1)
      })
    })
  })
})
