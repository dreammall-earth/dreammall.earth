import { ApolloServer } from '@apollo/server'

import { prisma } from '#src/prisma'
import { createTestServer } from '#src/server/server'

import type { Context } from '#src/context'

let testServer: ApolloServer<Context>

const query = `
  {
    adminDashboard {
      users {
        id
      }
    }
  }
`

const userTemplate: NonNullable<Context['user']> = {
  id: 99,
  username: 'mockedUser',
  name: 'User',
  introduction: null,
  availability: null,
  createdAt: new Date(Date.parse('2024-08-08T11:29:48.219Z')),
  meetingId: null,
  meeting: null,
  userDetail: [],
  socialMedia: [],
  roles: [],
}

describe('AdminDashboardResolver', () => {
  beforeAll(async () => {
    testServer = await createTestServer()
  })

  describe('as unauthenticated user', () => {
    it('responds with unauthorized error', async () => {
      await expect(testServer.executeOperation({ query })).resolves.toMatchObject({
        body: {
          kind: 'single',
          singleResult: {
            data: null,
            errors: [
              expect.objectContaining({
                message: "Access denied! You don't have permission for this action!",
              }),
            ],
          },
        },
      })
    })
  })

  describe('as authenticated user', () => {
    describe('but without admin role', () => {
      const user = {
        ...userTemplate,
        roles: [],
      }
      const contextValue: Context = { user, dataSources: { prisma } }

      it('responds with unauthorized error', async () => {
        await expect(
          testServer.executeOperation({ query }, { contextValue }),
        ).resolves.toMatchObject({
          body: {
            kind: 'single',
            singleResult: {
              data: null,
              errors: [
                expect.objectContaining({
                  message: "Access denied! You don't have permission for this action!",
                }),
              ],
            },
          },
        })
      })
    })

    describe('as admin user', () => {
      const user = {
        ...userTemplate,
        roles: ['admin' as const],
      }
      const contextValue: Context = { user, dataSources: { prisma } }

      it('responds admin dashboard data', async () => {
        await expect(
          testServer.executeOperation({ query }, { contextValue }),
        ).resolves.toMatchObject({
          body: {
            kind: 'single',
            singleResult: {
              data: {
                adminDashboard: {
                  users: [],
                },
              },
              errors: undefined,
            },
          },
        })
      })
    })
  })
})
