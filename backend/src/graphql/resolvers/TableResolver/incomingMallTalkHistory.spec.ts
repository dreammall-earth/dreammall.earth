import { ApolloServer } from '@apollo/server'

import { findOrCreateUser } from '#src/context/findOrCreateUser'
import { prisma } from '#src/prisma'
import { createTestServer } from '#src/server/server'
import { mockContextValue } from '#test/mockContextValue'

import type { Context } from '#src/context'
import type { UserWithProfile } from '#src/prisma'

const pk = 19
const nickname = 'mockedUser'
const name = 'User'

let testServer: ApolloServer<Context>

const createMyTableMutation = `mutation($name: String!, $isPublic: Boolean!, $userIds: [Int]) {
  createMyTable(name: $name, isPublic: $isPublic, userIds: $userIds) {
    id
    name
    public
    users {
      id
      role
      name
      username
    }
  }
}`

describe('TableResolver', () => {
  beforeAll(async () => {
    testServer = await createTestServer()
  })

  const query = `
    query {
      incomingMallTalkHistory {
        id
        status
        from {
          username
        }
      }
    }`

  describe('incomingMallTalkHistory', () => {
    describe('unauthorized', () => {
      it('throws access denied', async () => {
        await expect(
          testServer.executeOperation(
            {
              query,
            },
            { contextValue: mockContextValue() },
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

    describe('authorized', () => {
      let user: UserWithProfile
      let bibi: UserWithProfile

      beforeAll(async () => {
        user = await findOrCreateUser({ prisma })({ pk, nickname, name })
        bibi = await findOrCreateUser({ prisma })({
          pk: 99,
          nickname: 'bibi',
          name: 'Bibi Bloxberg',
        })

        await testServer.executeOperation(
          {
            query: createMyTableMutation,
            variables: {
              name: 'My Table',
              isPublic: false,
              userIds: [bibi.id],
            },
          },
          { contextValue: mockContextValue({ user }) },
        )
      })

      describe('as calling user', () => {
        it('returns an empty array', async () => {
          await expect(
            testServer.executeOperation(
              {
                query,
              },
              { contextValue: mockContextValue({ user }) },
            ),
          ).resolves.toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: {
                  incomingMallTalkHistory: [],
                },
                errors: undefined,
              },
            },
          })
        })
      })

      describe('as receiving user', () => {
        it('returns the call with status MISSED', async () => {
          await expect(
            testServer.executeOperation(
              {
                query,
              },
              { contextValue: mockContextValue({ user: bibi }) },
            ),
          ).resolves.toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: {
                  incomingMallTalkHistory: [
                    {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      id: expect.any(Number),
                      from: {
                        username: user.username,
                      },
                      status: 'MISSED',
                    },
                  ],
                },
                errors: undefined,
              },
            },
          })
        })

        it('changes the status to MISSED in database', async () => {
          await expect(prisma.mallTalkHistory.findFirst()).resolves.toEqual({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: expect.any(Number),
            fromId: user.id,
            toId: bibi.id,
            status: 'MISSED',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            tableId: expect.any(Number),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            createdAt: expect.any(Date),
          })
        })
      })
    })
  })
})
