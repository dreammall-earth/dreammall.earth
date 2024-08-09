import { ApolloServer } from '@apollo/server'

import { prisma } from '#src/prisma'
import { createTestServer } from '#src/server/server'

import type { Context } from '#src/context'

let testServer: ApolloServer<Context>

const query = `
{
  currentUser {
    id
    username
    name
    introduction
    details {
      id
      category
      text
    }
  }
}
`

// uses joinMyTable query
describe('authChecker', () => {
  beforeAll(async () => {
    testServer = await createTestServer()
  })

  describe('unauthenticated', () => {
    it('returns access denied error', async () => {
      await expect(
        testServer.executeOperation(
          {
            query,
          },
          { contextValue: { user: null, dataSources: { prisma } } },
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

  describe('authenticated', () => {
    const user: NonNullable<Context['user']> = {
      id: 81,
      username: 'mockedUser',
      name: 'Bibi Bloxberg',
      introduction: null,
      availability: null,
      createdAt: new Date(Date.parse('2024-08-07T21:20:17.484Z')),
      meetingId: null,
      meeting: null,
      userDetail: [{ id: 5, category: 'work', text: 'Schwer am Schuften', userId: 81 }],
      socialMedia: [],
      roles: [],
    }

    it('checks if a user is authenticated', async () => {
      await expect(
        testServer.executeOperation(
          {
            query,
          },
          {
            contextValue: {
              user,
              dataSources: { prisma },
            },
          },
        ),
      ).resolves.toMatchObject({
        body: {
          kind: 'single',
          singleResult: {
            data: {
              currentUser: {
                details: [
                  {
                    category: 'work',
                    id: 5,
                    text: 'Schwer am Schuften',
                  },
                ],
                id: 81,
                introduction: null,
                name: 'Bibi Bloxberg',
                username: 'mockedUser',
              },
            },
            errors: undefined,
          },
        },
      })
    })
  })
})
