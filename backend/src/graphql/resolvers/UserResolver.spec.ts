import { ApolloServer } from '@apollo/server'

import { prisma } from '#src/prisma'
import { createTestServer } from '#src/server/server'

import type { Context } from '#src/server/context'

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
          { contextValue: { dataSources: { prisma } } },
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
      describe('include self is false', () => {
        it('returns an empty list of users', async () => {
          const response = await testServer.executeOperation(
            {
              query: `{users {id name username}}`,
            },
            {
              contextValue: {
                token: 'token',
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
                token: 'token',
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
                token: 'token',
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
                token: 'token',
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
                token: 'token',
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
                token: 'token',
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
          { contextValue: { dataSources: { prisma } } },
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
      let userId: number | undefined

      describe('no table', () => {
        it('returns the user without table', async () => {
          const user = await prisma.user.findFirst()
          userId = user?.id
          const response = await testServer.executeOperation(
            {
              query,
            },
            {
              contextValue: {
                token: 'token',
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
                token: 'token',
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
                token: 'token',
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
          { contextValue: { dataSources: { prisma } } },
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
      beforeAll(async () => {
        await prisma.user.update({
          where: {
            username: 'mockedUser',
          },
          data: {
            meetingId: null,
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
        it('returns updated current user', async () => {
          await expect(
            testServer.executeOperation(
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
                  token: 'token',
                  dataSources: { prisma },
                },
              },
            ),
          ).resolves.toMatchObject({
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
                  token: 'token',
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
        it('does not change introduction and availability', async () => {
          await expect(
            testServer.executeOperation(
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
                  token: 'token',
                  dataSources: { prisma },
                },
              },
            ),
          ).resolves.toMatchObject({
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
        it('deletes introduction and availability', async () => {
          await expect(
            testServer.executeOperation(
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
                  token: 'token',
                  dataSources: { prisma },
                },
              },
            ),
          ).resolves.toMatchObject({
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
          { contextValue: { dataSources: { prisma } } },
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
                  token: 'token',
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
                  token: 'token',
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
          { contextValue: { dataSources: { prisma } } },
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
                  token: 'token',
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
                  token: 'token',
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
                  token: 'token',
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
})
