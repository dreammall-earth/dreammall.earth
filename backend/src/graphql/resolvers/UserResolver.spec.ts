import { ApolloServer } from '@apollo/server'

import { prisma } from '#src/prisma'
import { createTestServer } from '#src/server/server'

let testServer: ApolloServer

beforeAll(async () => {
  testServer = await createTestServer()
})

describe('UserResolver', () => {
  describe('users query', () => {
    describe('unauthenticated', () => {
      it('returns an unauthenticated error', async () => {
        const response = await testServer.executeOperation({
          query: `{users {id name username}}`,
        })
        expect(response).toMatchObject({
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
      it('returns a list of users', async () => {
        const response = await testServer.executeOperation(
          {
            query: `{users {id name username}}`,
          },
          {
            contextValue: {
              token: 'token',
              user: undefined,
            },
          },
        )
        expect(response).toMatchObject({
          body: {
            kind: 'single',
            singleResult: {
              data: {
                users: [
                  {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    id: expect.any(Number),
                    name: 'User',
                    username: 'mockedUser',
                  },
                ],
              },
              errors: undefined,
            },
          },
        })
      })
    })
  })

  describe('current user query', () => {
    const query = `{
  currentUser {
    id
    name
    username
    room {
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
  }
}`

    describe('unauthenticated', () => {
      it('returns an unauthenticated error', async () => {
        const response = await testServer.executeOperation({
          query,
        })
        expect(response).toMatchObject({
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
      let userId: number | undefined

      describe('no room', () => {
        it('returns the user without room', async () => {
          const user = await prisma.user.findFirst()
          userId = user?.id
          const response = await testServer.executeOperation(
            {
              query,
            },
            {
              contextValue: {
                token: 'token',
              },
            },
          )
          expect(response).toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: {
                  currentUser: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    id: expect.any(Number),
                    name: 'User',
                    username: 'mockedUser',
                    room: null,
                  },
                },
                errors: undefined,
              },
            },
          })
        })
      })

      describe('with public room', () => {
        beforeAll(async () => {
          await prisma.user.update({
            where: { id: userId },
            data: {
              meeting: {
                create: {
                  name: 'My Meeting',
                  meetingID: 'my-meeting',
                  public: true,
                },
              },
            },
          })
        })

        it('returns the user with room', async () => {
          const response = await testServer.executeOperation(
            {
              query,
            },
            {
              contextValue: {
                token: 'token',
              },
            },
          )
          expect(response).toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: {
                  currentUser: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    id: expect.any(Number),
                    name: 'User',
                    username: 'mockedUser',
                    room: {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      id: expect.any(Number),
                      name: 'My Meeting',
                      public: true,
                      users: [],
                    },
                  },
                },
                errors: undefined,
              },
            },
          })
        })
      })

      describe('with private room', () => {
        let meetingId: number | undefined

        beforeAll(async () => {
          const meeting = await prisma.meeting.findFirst()
          meetingId = meeting?.id

          const bibi = await prisma.user.create({
            data: {
              username: 'bibi',
              name: 'Bibi Bloxberg',
            },
          })

          const peter = await prisma.user.create({
            data: {
              username: 'peter',
              name: 'Peter Lustig',
            },
          })

          await prisma.user.update({
            where: { id: userId },
            data: {
              meeting: {
                update: {
                  name: 'My Meeting',
                  meetingID: 'my-meeting',
                  public: false,
                  /*
                  users: {
                    createMany: {
                      data: [
                        {
                          meetingId: meetingId,
                          userId: bibi.id,
                        },
                        {
                          meetingId: meetingId,
                          userId: peter.id,
                        },
                      ],
                    },
                  },
                  */
                },
              },
            },
          })

          await prisma.usersInMeetings.create({
            data: {
              meetingId: meetingId ?? 1,
              userId: bibi.id,
            },
          })

          await prisma.usersInMeetings.create({
            data: {
              meetingId: meetingId ?? 2,
              userId: peter.id,
            },
          })
        })

        it('returns the user with room and users', async () => {
          const response = await testServer.executeOperation(
            {
              query,
            },
            {
              contextValue: {
                token: 'token',
              },
            },
          )
          expect(response).toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: {
                  currentUser: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    id: expect.any(Number),
                    name: 'User',
                    username: 'mockedUser',
                    room: {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      id: expect.any(Number),
                      name: 'My Meeting',
                      public: false,
                      users: [
                        {
                          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                          id: expect.any(Number),
                          username: 'bibi',
                          name: 'Bibi Bloxberg',
                          role: 'MODERATOR',
                        },
                        {
                          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                          id: expect.any(Number),
                          username: 'peter',
                          name: 'Peter Lustig',
                          role: 'MODERATOR',
                        },
                      ],
                    },
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
})
