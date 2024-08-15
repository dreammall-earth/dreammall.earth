import { ApolloServer } from '@apollo/server'

import { findOrCreateUser } from '#src/context/findOrCreateUser'
import { prisma } from '#src/prisma'
import { createTestServer } from '#src/server/server'

import type { Context } from '#src/context'
import type { UserWithProfile } from '#src/prisma'

const nickname = 'mockedUser'
const name = 'User'

let testServer: ApolloServer<Context>

describe('UserResolver', () => {
  beforeAll(async () => {
    testServer = await createTestServer()
  })

  describe('users query', () => {
    describe('unauthenticated', () => {
      it('returns an unauthenticated error', async () => {
        const response = await testServer.executeOperation(
          {
            query: `{users {id name username}}`,
          },
          { contextValue: { user: null, dataSources: { prisma } } },
        )
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
      let user: UserWithProfile
      beforeEach(async () => {
        user = await findOrCreateUser({ nickname, name })
      })

      describe('include self is false', () => {
        it('returns an empty list of users', async () => {
          const response = await testServer.executeOperation(
            {
              query: `{users {id name username}}`,
            },
            {
              contextValue: {
                user,
                dataSources: { prisma },
              },
            },
          )
          expect(response).toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: {
                  users: [],
                },
                errors: undefined,
              },
            },
          })
        })
      })

      describe('include self is true', () => {
        it('returns a list of users', async () => {
          const response = await testServer.executeOperation(
            {
              query: `query ($includeSelf: Boolean) {users(includeSelf: $includeSelf) {id name username}}`,
              variables: { includeSelf: true },
            },
            {
              contextValue: {
                user,
                dataSources: { prisma },
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

      describe('include search string', () => {
        beforeAll(async () => {
          await prisma.user.createMany({
            data: [
              {
                name: 'Thomas Schmitt',
                username: 'tom',
              },
              {
                name: 'Thomas Schmidt',
                username: 'Toms',
              },
              {
                name: 'Tomas Schmid',
                username: 'Schmid',
              },
              {
                name: 'Tomás Schmit',
                username: 'Schmit',
              },
            ],
          })
        })

        it('returns the correct users for "tom"', async () => {
          const response = await testServer.executeOperation(
            {
              query: `query ($searchString: String) {users(searchString: $searchString) {id name username}}`,
              variables: { searchString: 'tom' },
            },
            {
              contextValue: {
                user,
                dataSources: { prisma },
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
                      name: 'Thomas Schmitt',
                      username: 'tom',
                    },
                    {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      id: expect.any(Number),
                      name: 'Thomas Schmidt',
                      username: 'Toms',
                    },
                    {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      id: expect.any(Number),
                      name: 'Tomas Schmid',
                      username: 'Schmid',
                    },
                    {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      id: expect.any(Number),
                      name: 'Tomás Schmit',
                      username: 'Schmit',
                    },
                  ],
                },
                errors: undefined,
              },
            },
          })
        })

        it('returns the correct users for "TOM"', async () => {
          const response = await testServer.executeOperation(
            {
              query: `query ($searchString: String) {users(searchString: $searchString) {id name username}}`,
              variables: { searchString: 'TOM' },
            },
            {
              contextValue: {
                user,
                dataSources: { prisma },
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
                      name: 'Thomas Schmitt',
                      username: 'tom',
                    },
                    {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      id: expect.any(Number),
                      name: 'Thomas Schmidt',
                      username: 'Toms',
                    },
                    {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      id: expect.any(Number),
                      name: 'Tomas Schmid',
                      username: 'Schmid',
                    },
                    {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      id: expect.any(Number),
                      name: 'Tomás Schmit',
                      username: 'Schmit',
                    },
                  ],
                },
                errors: undefined,
              },
            },
          })
        })

        it('returns the correct users for "sch"', async () => {
          const response = await testServer.executeOperation(
            {
              query: `query ($searchString: String) {users(searchString: $searchString) {id name username}}`,
              variables: { searchString: 'sch' },
            },
            {
              contextValue: {
                user,
                dataSources: { prisma },
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
                      name: 'Thomas Schmitt',
                      username: 'tom',
                    },
                    {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      id: expect.any(Number),
                      name: 'Thomas Schmidt',
                      username: 'Toms',
                    },
                    {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      id: expect.any(Number),
                      name: 'Tomas Schmid',
                      username: 'Schmid',
                    },
                    {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      id: expect.any(Number),
                      name: 'Tomás Schmit',
                      username: 'Schmit',
                    },
                  ],
                },
                errors: undefined,
              },
            },
          })
        })

        it('returns the correct users for "tomas"', async () => {
          const response = await testServer.executeOperation(
            {
              query: `query ($searchString: String) {users(searchString: $searchString) {id name username}}`,
              variables: { searchString: 'tomas' },
            },
            {
              contextValue: {
                user,
                dataSources: { prisma },
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
                      name: 'Tomas Schmid',
                      username: 'Schmid',
                    },
                    {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      id: expect.any(Number),
                      name: 'Tomás Schmit',
                      username: 'Schmit',
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
  })

  describe('current user query', () => {
    const query = `{
  currentUser {
    id
    name
    username
    details {
      category
      text
    }
    social {
      type
      link
    }
    table {
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
        const response = await testServer.executeOperation(
          { query },
          { contextValue: { user: null, dataSources: { prisma } } },
        )
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
      let user: UserWithProfile
      beforeEach(async () => {
        user = await findOrCreateUser({ nickname, name })
      })
      let userId: number | undefined

      describe('no table', () => {
        it('returns the user without table', async () => {
          userId = user?.id
          const response = await testServer.executeOperation(
            {
              query,
            },
            {
              contextValue: {
                user,
                dataSources: { prisma },
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
                    table: null,
                  },
                },
                errors: undefined,
              },
            },
          })
        })
      })

      describe('with public table', () => {
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

        it('returns the user with table', async () => {
          const response = await testServer.executeOperation(
            {
              query,
            },
            {
              contextValue: {
                user,
                dataSources: { prisma },
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
                    table: {
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

      describe('with private table', () => {
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

        it('returns the user with table and users', async () => {
          const response = await testServer.executeOperation(
            {
              query,
            },
            {
              contextValue: {
                user,
                dataSources: { prisma },
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
                    table: {
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

  describe('updateUser mutation', () => {
    const query = `mutation updateUser($data: UpdateUserInput!) {
  updateUser(data: $data) {
    id
    name
    username
    introduction
    availability
    details {
      category
      text
    }
    social {
      type
      link
    }
    table {
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
        const response = await testServer.executeOperation(
          {
            query,
            variables: {
              data: {
                name: 'User',
              },
            },
          },
          { contextValue: { user: null, dataSources: { prisma } } },
        )
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
      let user: UserWithProfile
      beforeEach(async () => {
        user = await findOrCreateUser({ nickname, name })
        await prisma.user.update({
          where: {
            username: 'mockedUser',
          },
          data: {
            meetingId: null,
          },
        })
      })
      afterEach(async () => {
        await prisma.user.delete({
          where: {
            username: 'mockedUser',
          },
        })
      })

      it('has the default user in the database', async () => {
        await expect(
          prisma.user.findUnique({
            where: {
              username: 'mockedUser',
            },
          }),
        ).resolves.toEqual({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: expect.any(Number),
          username: 'mockedUser',
          name: 'User',
          introduction: null,
          availability: null,
          meetingId: null,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          createdAt: expect.any(Date),
        })
      })

      describe('send values for all fields', () => {
        const action = () => {
          return testServer.executeOperation(
            {
              query,
              variables: {
                data: {
                  name: 'Peter Lustig',
                  introduction: 'Latzhose und Nickelbrille',
                  availability: 'busy',
                },
              },
            },
            {
              contextValue: {
                user,
                dataSources: { prisma },
              },
            },
          )
        }

        it('returns updated current user', async () => {
          await expect(action()).resolves.toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: {
                  updateUser: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    id: expect.any(Number),
                    name: 'Peter Lustig',
                    username: 'mockedUser',
                    introduction: 'Latzhose und Nickelbrille',
                    availability: 'busy',
                    details: [],
                    social: [],
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    table: expect.any(Object),
                  },
                },
                errors: undefined,
              },
            },
          })
        })

        it('updates the database', async () => {
          await action()
          await expect(
            prisma.user.findUnique({
              where: {
                username: 'mockedUser',
              },
            }),
          ).resolves.toEqual({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: expect.any(Number),
            username: 'mockedUser',
            name: 'Peter Lustig',
            introduction: 'Latzhose und Nickelbrille',
            availability: 'busy',
            meetingId: null,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            createdAt: expect.any(Date),
          })
        })
      })

      describe('introduction is too long', () => {
        it('throws validation error', async () => {
          await expect(
            testServer.executeOperation(
              {
                query,
                variables: {
                  data: {
                    name: 'Peter Lustig',
                    introduction:
                      'Trägt immer Latzhose und Nickelbrille, lebt in einem blauen Bauwagen und macht jede Menge kuriose Sachen. Am Ende sagt er immer "Abschalten"',
                    availability: 'busy',
                  },
                },
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
                data: null,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                errors: expect.arrayContaining([
                  expect.objectContaining({
                    message: 'Argument Validation Error',
                  }),
                ]),
              },
            },
          })
        })
      })

      describe('introduction and availability is not passed', () => {
        const action = async () => {
          await prisma.user.update({
            where: {
              username: 'mockedUser',
            },
            data: {
              availability: 'busy',
              introduction: 'Latzhose und Nickelbrille',
              name: 'Peter Lustig',
            },
          })
          return testServer.executeOperation(
            {
              query,
              variables: {
                data: {
                  name: 'Bibi Bloxberg',
                },
              },
            },
            {
              contextValue: {
                user,
                dataSources: { prisma },
              },
            },
          )
        }

        it('does not change introduction and availability', async () => {
          await expect(action()).resolves.toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: {
                  updateUser: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    id: expect.any(Number),
                    name: 'Bibi Bloxberg',
                    username: 'mockedUser',
                    introduction: 'Latzhose und Nickelbrille',
                    availability: 'busy',
                    details: [],
                    social: [],
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    table: expect.any(Object),
                  },
                },
                errors: undefined,
              },
            },
          })
        })

        it('updates only the name in the database', async () => {
          await action()
          await expect(
            prisma.user.findUnique({
              where: {
                username: 'mockedUser',
              },
            }),
          ).resolves.toEqual({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: expect.any(Number),
            name: 'Bibi Bloxberg',
            username: 'mockedUser',
            introduction: 'Latzhose und Nickelbrille',
            availability: 'busy',
            meetingId: null,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            createdAt: expect.any(Date),
          })
        })
      })

      describe('introduction and availability is null', () => {
        beforeEach(async () => {
          await prisma.user.update({
            where: {
              username: 'mockedUser',
            },
            data: {
              introduction: 'Make me null',
              availability: 'busy',
            },
          })
        })

        const action = async () => {
          return testServer.executeOperation(
            {
              query,
              variables: {
                data: {
                  name: 'Bibi Bloxberg',
                  introduction: null,
                  availability: null,
                },
              },
            },
            {
              contextValue: {
                user,
                dataSources: { prisma },
              },
            },
          )
        }

        it('deletes introduction and availability', async () => {
          await expect(action()).resolves.toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: {
                  updateUser: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    id: expect.any(Number),
                    name: 'Bibi Bloxberg',
                    username: 'mockedUser',
                    introduction: null,
                    availability: null,
                    details: [],
                    social: [],
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    table: expect.any(Object),
                  },
                },
                errors: undefined,
              },
            },
          })
        })

        it('updates the database', async () => {
          await expect(
            prisma.user.findUnique({
              where: {
                username: 'mockedUser',
              },
            }),
          ).resolves.toEqual({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: expect.any(Number),
            name: 'User',
            username: 'mockedUser',
            introduction: 'Make me null',
            availability: 'busy',
            meetingId: null,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            createdAt: expect.any(Date),
          })
          await action()
          await expect(
            prisma.user.findUnique({
              where: {
                username: 'mockedUser',
              },
            }),
          ).resolves.toEqual({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: expect.any(Number),
            name: 'Bibi Bloxberg',
            username: 'mockedUser',
            introduction: null,
            availability: null,
            meetingId: null,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            createdAt: expect.any(Date),
          })
        })
      })
    })
  })

  describe('addUserDetail mutation', () => {
    const query = `mutation addUserDetail($data: AddUserDetailInput!) {
  addUserDetail(data: $data) {
    id
    text
    category
  }
}`

    describe('unauthenticated', () => {
      it('returns an unauthenticated error', async () => {
        const response = await testServer.executeOperation(
          {
            query,
            variables: {
              data: {
                category: 'work',
                text: 'Schwer am Schuften',
              },
            },
          },
          { contextValue: { user: null, dataSources: { prisma } } },
        )
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
      let user: UserWithProfile
      beforeEach(async () => {
        user = await findOrCreateUser({ nickname, name })
      })

      describe('with valid data', () => {
        it('returns user detail', async () => {
          await expect(
            testServer.executeOperation(
              {
                query,
                variables: {
                  data: {
                    category: 'work',
                    text: 'Schwer am Schuften',
                  },
                },
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
                  addUserDetail: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    id: expect.any(Number),
                    category: 'work',
                    text: 'Schwer am Schuften',
                  },
                },
                errors: undefined,
              },
            },
          })
        })

        it('creates userDetail in database', async () => {
          await expect(prisma.userDetail.findMany()).resolves.toEqual([
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              userId: expect.any(Number),
              category: 'work',
              text: 'Schwer am Schuften',
            },
          ])
        })
      })

      describe('text is too long', () => {
        it('throws validation error', async () => {
          await expect(
            testServer.executeOperation(
              {
                query,
                variables: {
                  data: {
                    category: 'work',
                    text: 'Ich arbeite sehr hart in den Diamanten-Minen der Republik Kongo',
                  },
                },
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
                data: null,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                errors: expect.arrayContaining([
                  expect.objectContaining({
                    message: 'Argument Validation Error',
                  }),
                ]),
              },
            },
          })
        })
      })
    })
  })

  describe('removeUserDetail mutation', () => {
    const query = `mutation removeUserDetail($id: Int!) {
  removeUserDetail(id: $id)
}`

    describe('unauthenticated', () => {
      it('returns an unauthenticated error', async () => {
        const response = await testServer.executeOperation(
          {
            query,
            variables: {
              id: -1,
            },
          },
          { contextValue: { user: null, dataSources: { prisma } } },
        )
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
      let user: UserWithProfile
      beforeEach(async () => {
        user = await findOrCreateUser({ nickname, name })
      })
      describe('detail id does not exist', () => {
        it('throws detail not found error', async () => {
          await expect(
            testServer.executeOperation(
              {
                query,
                variables: {
                  id: -1,
                },
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
                data: null,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                errors: expect.arrayContaining([
                  expect.objectContaining({
                    message: 'Detail not found!',
                  }),
                ]),
              },
            },
          })
        })
      })

      describe('detail belongs to another user', () => {
        let detailId: number | undefined

        beforeAll(async () => {
          const bibi = await prisma.user.findUnique({
            where: {
              username: 'bibi',
            },
          })

          if (bibi) {
            const detail = await prisma.userDetail.create({
              data: {
                userId: bibi.id,
                category: 'work',
                text: 'Ich arbeite im Hexenhaus',
              },
            })

            detailId = detail?.id
          }
        })

        afterAll(async () => {
          await prisma.userDetail.delete({
            where: {
              id: detailId,
            },
          })
        })

        it('throws detail not found error', async () => {
          await expect(
            testServer.executeOperation(
              {
                query,
                variables: {
                  id: detailId,
                },
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
                data: null,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                errors: expect.arrayContaining([
                  expect.objectContaining({
                    message: 'Detail not found!',
                  }),
                ]),
              },
            },
          })
        })
      })

      describe('detail belongs to user', () => {
        let detailId: number | undefined

        beforeAll(async () => {
          const detail = await prisma.userDetail.findFirst()
          detailId = detail?.id
        })

        it('returns true', async () => {
          await expect(
            testServer.executeOperation(
              {
                query,
                variables: {
                  id: detailId,
                },
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
                  removeUserDetail: true,
                },
                errors: undefined,
              },
            },
          })
        })

        it('deletes the detail in the database', async () => {
          await expect(
            prisma.userDetail.findFirst({
              where: {
                id: detailId,
              },
            }),
          ).resolves.toBeNull()
        })
      })
    })
  })

  describe('addSocialMedia mutation', () => {
    const query = `mutation addSocialMedia($data: AddSocialMediaInput!) {
  addSocialMedia(data: $data) {
    id
    link
    type
  }
}`

    describe('unauthenticated', () => {
      it('returns an unauthenticated error', async () => {
        const response = await testServer.executeOperation(
          {
            query,
            variables: {
              data: {
                link: 'https://yunite.me/user/ork',
                type: 'discord',
              },
            },
          },
          { contextValue: { user: null, dataSources: { prisma } } },
        )
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
      let user: UserWithProfile
      beforeEach(async () => {
        user = await findOrCreateUser({ nickname, name })
      })

      describe('with valid data', () => {
        it('returns social media', async () => {
          await expect(
            testServer.executeOperation(
              {
                query,
                variables: {
                  data: {
                    link: 'https://yunite.me/user/ork',
                    type: 'discord',
                  },
                },
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
                  addSocialMedia: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    id: expect.any(Number),
                    link: 'https://yunite.me/user/ork',
                    type: 'discord',
                  },
                },
                errors: undefined,
              },
            },
          })
        })

        it('creates socialMedia in database', async () => {
          await expect(prisma.socialMedia.findMany()).resolves.toEqual([
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              userId: expect.any(Number),
              link: 'https://yunite.me/user/ork',
              type: 'discord',
            },
          ])
        })
      })

      describe('link is too long', () => {
        it('throws validation error', async () => {
          await expect(
            testServer.executeOperation(
              {
                query,
                variables: {
                  data: {
                    link: 'https://yunite.me/user/ork/478924y8919246192946192yqworyqwqwhkshfksdfhalsfksafhasafskñakfañsfkañsjfqw9ruasñfjslakjañsfjñalsfjñ',
                    type: 'discord',
                  },
                },
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
                data: null,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                errors: expect.arrayContaining([
                  expect.objectContaining({
                    message: 'Argument Validation Error',
                  }),
                ]),
              },
            },
          })
        })
      })
    })
  })

  describe('removeSocialMedia mutation', () => {
    const query = `mutation removeSocialMedia($id: Int!) {
  removeSocialMedia(id: $id)
}`

    describe('unauthenticated', () => {
      it('returns an unauthenticated error', async () => {
        const response = await testServer.executeOperation(
          {
            query,
            variables: {
              id: -1,
            },
          },
          { contextValue: { user: null, dataSources: { prisma } } },
        )
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
      let user: UserWithProfile
      beforeEach(async () => {
        user = await findOrCreateUser({ nickname, name })
      })

      describe('social media id does not exist', () => {
        it('throws social media not found error', async () => {
          await expect(
            testServer.executeOperation(
              {
                query,
                variables: {
                  id: -1,
                },
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
                data: null,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                errors: expect.arrayContaining([
                  expect.objectContaining({
                    message: 'Social media not found!',
                  }),
                ]),
              },
            },
          })
        })
      })

      describe('social media belongs to another user', () => {
        let socialMediaId: number | undefined

        beforeAll(async () => {
          const bibi = await prisma.user.findUnique({
            where: {
              username: 'bibi',
            },
          })

          if (bibi) {
            const sM = await prisma.socialMedia.create({
              data: {
                userId: bibi.id,
                type: 'telegram',
                link: 't.me/bibiBloxberg',
              },
            })

            socialMediaId = sM?.id
          }
        })

        afterAll(async () => {
          await prisma.socialMedia.delete({
            where: {
              id: socialMediaId,
            },
          })
        })

        it('throws social media not found error', async () => {
          await expect(
            testServer.executeOperation(
              {
                query,
                variables: {
                  id: socialMediaId,
                },
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
                data: null,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                errors: expect.arrayContaining([
                  expect.objectContaining({
                    message: 'Social media not found!',
                  }),
                ]),
              },
            },
          })
        })
      })

      describe('social media belongs to user', () => {
        let socialMediaId: number | undefined

        beforeAll(async () => {
          const sM = await prisma.socialMedia.findFirst()
          socialMediaId = sM?.id
        })

        it('returns true', async () => {
          await expect(
            testServer.executeOperation(
              {
                query,
                variables: {
                  id: socialMediaId,
                },
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
                  removeSocialMedia: true,
                },
                errors: undefined,
              },
            },
          })
        })

        it('deletes the detail in the database', async () => {
          await expect(
            prisma.userDetail.findFirst({
              where: {
                id: socialMediaId,
              },
            }),
          ).resolves.toBeNull()
        })
      })
    })
  })
})
