import { ApolloServer } from '@apollo/server'
import { Meeting } from '@prisma/client'

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
    mutation($tableId: Int!, $fromId: Int!, $status: MallTalkStatus!) {
      updateMallTalkHistoryStatus(tableId: $tableId, fromId: $fromId, status: $status) {
        id
        status
        from {
          username
        }
      }
    }
  `

  describe('updateMallTalkHistoryStatus', () => {
    describe('unauthorized', () => {
      it('throws access denied', async () => {
        await expect(
          testServer.executeOperation(
            {
              query,
              variables: {
                tableId: -1,
                fromId: -1,
                status: 'ACCEPTED',
              },
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
      let meeting: Meeting | null

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

        meeting = await prisma.meeting.findFirst()
      })

      describe('tableId does not exist', () => {
        it('throws history not found', async () => {
          await expect(
            testServer.executeOperation(
              {
                query,
                variables: {
                  tableId: -1,
                  fromId: user.id,
                  status: 'ACCEPTED',
                },
              },
              { contextValue: mockContextValue({ user }) },
            ),
          ).resolves.toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: null,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                errors: expect.arrayContaining([
                  expect.objectContaining({
                    message: 'History entry not found!',
                  }),
                ]),
              },
            },
          })
        })
      })

      describe('user was not called', () => {
        it('throws history not found', async () => {
          await expect(
            testServer.executeOperation(
              {
                query,
                variables: {
                  tableId: meeting?.id,
                  fromId: user.id,
                  status: 'ACCEPTED',
                },
              },
              { contextValue: mockContextValue({ user }) },
            ),
          ).resolves.toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: null,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                errors: expect.arrayContaining([
                  expect.objectContaining({
                    message: 'History entry not found!',
                  }),
                ]),
              },
            },
          })
        })
      })

      describe('user was called', () => {
        it('returns the updated history entry', async () => {
          await expect(
            testServer.executeOperation(
              {
                query,
                variables: {
                  tableId: meeting?.id,
                  fromId: user.id,
                  status: 'ACCEPTED',
                },
              },
              { contextValue: mockContextValue({ user: bibi }) },
            ),
          ).resolves.toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: {
                  updateMallTalkHistoryStatus: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    id: expect.any(Number),
                    status: 'ACCEPTED',
                    from: {
                      username: user.username,
                    },
                  },
                },
                errors: undefined,
              },
            },
          })
        })

        it('updates history entry in database', async () => {
          await expect(prisma.mallTalkHistory.findFirst()).resolves.toMatchObject({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: expect.any(Number),
            fromId: user.id,
            toId: bibi.id,
            status: 'ACCEPTED',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            createdAt: expect.any(Date),
            tableId: meeting?.id,
          })
        })
      })
    })
  })
})
