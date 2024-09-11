import { ApolloServer } from '@apollo/server'

import { createMeeting, joinMeetingLink, getMeetings, AttendeeRole } from '#api/BBB'
import { CONFIG } from '#config/config'
import { findOrCreateUser } from '#src/context/findOrCreateUser'
import { prisma } from '#src/prisma'
import { createTestServer } from '#src/server/server'

import type { Context } from '#src/context'
import type { UserWithProfile } from '#src/prisma'

jest.mock('#api/BBB')

const createMeetingMock = jest.mocked(createMeeting)
const joinMeetingLinkMock = jest.mocked(joinMeetingLink)
const getMeetingsMock = jest.mocked(getMeetings)

let testServer: ApolloServer<Context>

CONFIG.FRONTEND_URL = 'https://my.frontend.url'

const nickname = 'mockedUser'
const name = 'User'

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

const updateMyTableMutation = `mutation($name: String!, $isPublic: Boolean!, $userIds: [Int]) {
  updateMyTable(name: $name, isPublic: $isPublic, userIds: $userIds) {
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

const createTableMutation = `mutation CreateTable($isPublic: Boolean!, $name: String!, $userIds: [Int]) {
  createTable(isPublic: $isPublic, name: $name, userIds: $userIds) {
    id
    name
    public
    users {
      id
      name
      role
    }
  }
}`

const tablesQuery = `{
  tables {
    id
    name
    public
    users {
      id
      name
      role
      username
    }
  }
}`

const deleteTableMutation = `mutation DeleteTable($tableId: Int!) {
  deleteTable(tableId: $tableId)
}`

describe('TableResolver', () => {
  beforeAll(async () => {
    testServer = await createTestServer()
  })

  describe('unauthorized', () => {
    describe('createMyTable', () => {
      it('throws access denied', async () => {
        await expect(
          testServer.executeOperation(
            {
              query: createMyTableMutation,
              variables: {
                name: 'My Table',
                isPublic: true,
                userIds: [],
              },
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

    describe('updateMyTable', () => {
      it('throws access denied', async () => {
        await expect(
          testServer.executeOperation(
            {
              query: updateMyTableMutation,
              variables: {
                name: 'My Table',
                isPublic: true,
                userIds: [],
              },
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

    describe('joinMyTable', () => {
      it('throws access denied', async () => {
        await expect(
          testServer.executeOperation(
            {
              query: 'mutation { joinMyTable }',
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

    describe('createTable', () => {
      it('throws access denied', async () => {
        await expect(
          testServer.executeOperation(
            {
              query: createTableMutation,
              variables: {
                name: 'Group Table',
                isPublic: true,
                userIds: [],
              },
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

    describe('joinTable', () => {
      const query = `
        query ($tableId: Int!) {
          joinTable(tableId: $tableId)
        }
      `

      it('throws access denied', async () => {
        await expect(
          testServer.executeOperation(
            {
              query,
              variables: {
                tableId: 69,
              },
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

    describe('openTables', () => {
      it('throws access denied', async () => {
        await expect(
          testServer.executeOperation(
            {
              query: 'query { openTables { meetingName } }',
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

    describe('joinTableAsGuest', () => {
      const query = `
        query ($tableId: Int!, $userName: String!) {
          joinTableAsGuest(tableId: $tableId, userName: $userName)
        }
      `
      describe('No table in DB', () => {
        it('throws an Error', async () => {
          await expect(
            testServer.executeOperation(
              {
                query,
                variables: {
                  userName: 'Pinky Pie',
                  tableId: 25,
                },
              },
              { contextValue: { user: null, dataSources: { prisma } } },
            ),
          ).resolves.toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: null,
                errors: [expect.objectContaining({ message: 'Table does not exist' })],
              },
            },
          })
        })
      })

      describe('table in DB', () => {
        let tableId: number
        beforeEach(async () => {
          joinMeetingLinkMock.mockReturnValue('https://my-link')
          const meeting = await prisma.meeting.create({
            data: {
              name: 'Pony Ville',
              meetingID: 'Pony Ville',
            },
          })
          tableId = meeting.id
        })

        afterEach(async () => {
          await prisma.meeting.deleteMany()
        })

        it('returns link to table', async () => {
          await expect(
            testServer.executeOperation(
              {
                query,
                variables: {
                  userName: 'Pinky Pie',
                  tableId,
                },
              },
              { contextValue: { user: null, dataSources: { prisma } } },
            ),
          ).resolves.toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: { joinTableAsGuest: 'https://my-link' },

                errors: undefined,
              },
            },
          })
        })

        it('calls join meeting link', async () => {
          await testServer.executeOperation(
            {
              query,
              variables: {
                userName: 'Pinky Pie',
                tableId,
              },
            },
            { contextValue: { user: null, dataSources: { prisma } } },
          )
          expect(joinMeetingLinkMock).toHaveBeenCalledWith({
            fullName: 'Pinky Pie',
            meetingID: 'Pony Ville',
            password: '',
          })
        })
      })
    })

    describe('tables', () => {
      it('throws access denied', async () => {
        await expect(
          testServer.executeOperation(
            {
              query: tablesQuery,
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

    describe('deleteTable', () => {
      it('throws access denied', async () => {
        await expect(
          testServer.executeOperation(
            {
              query: deleteTableMutation,
              variables: {
                tableId: -1,
              },
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
  })

  describe('authorized', () => {
    let user: UserWithProfile
    let bibiUser: UserWithProfile
    let peterUser: UserWithProfile
    let raeuberUser: UserWithProfile
    beforeAll(async () => {
      user = await findOrCreateUser({ nickname, name })
      bibiUser = await findOrCreateUser({ nickname: 'bibi', name: 'Bibi Bloxberg' })
      peterUser = await findOrCreateUser({ nickname: 'peter', name: 'Peter Lustig' })
      raeuberUser = await findOrCreateUser({ nickname: 'raeuber', name: 'Räuber Hotzenplotz' })
    })

    describe('createMyTable', () => {
      describe('meeting does not exist', () => {
        it('returns Table', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: createMyTableMutation,
                variables: {
                  name: 'My Table',
                  isPublic: true,
                  userIds: [],
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
                  createMyTable: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    id: expect.any(Number),
                    name: 'My Table',
                    public: true,
                    users: [],
                  },
                },
                errors: undefined,
              },
            },
          })
        })

        it('creates meeting in database', async () => {
          await expect(
            prisma.user.findFirst({
              where: {
                id: user.id,
              },
              include: {
                meeting: true,
              },
            }),
          ).resolves.toMatchObject({
            meeting: {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              meetingID: expect.any(String),
              name: 'My Table',
              public: true,
            },
          })
        })

        it('creates create my table event in the database', async () => {
          const user = await prisma.user.findUnique({
            where: {
              username: nickname,
            },
          })
          const result = await prisma.event.findMany({
            orderBy: {
              createdAt: 'asc',
            },
          })

          expect(result).toEqual([
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              involvedEmail: null,
              type: 'CREATE_USER',
              involvedUserId: user?.id,
            },
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              involvedEmail: null,
              type: 'CREATE_USER',
              involvedUserId: bibiUser.id,
            },
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              involvedEmail: null,
              type: 'CREATE_USER',
              involvedUserId: peterUser.id,
            },
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              involvedEmail: null,
              type: 'CREATE_USER',
              involvedUserId: raeuberUser.id,
            },
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              involvedEmail: null,
              type: 'CREATE_MY_TABLE',
              involvedUserId: user?.id,
            },
          ])
        })
      })

      describe('meeting exists', () => {
        it('creates new meeting and deletes old one', async () => {
          user = await findOrCreateUser({ name: user.name, nickname: user.username })

          expect(user).not.toBeNull()

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const oldMeetingID = user!.meetingId!

          await expect(
            testServer.executeOperation(
              {
                query: createMyTableMutation,
                variables: {
                  name: 'My Second Table',
                  isPublic: true,
                  userIds: [],
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
                  createMyTable: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    id: expect.any(Number),
                    name: 'My Second Table',
                    public: true,
                    users: [],
                  },
                },
                errors: undefined,
              },
            },
          })

          await expect(
            prisma.meeting.findUnique({ where: { id: oldMeetingID } }),
          ).resolves.toBeNull()
        })
      })

      describe('private meeting', () => {
        beforeAll(async () => {
          await prisma.usersInMeetings.deleteMany()
          await prisma.meeting.deleteMany()
          user = {
            ...user,
            meetingId: null,
          }
        })

        it('returns table with users', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: createMyTableMutation,
                variables: {
                  name: 'My Table',
                  isPublic: false,
                  userIds: [bibiUser.id, peterUser.id],
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
                  createMyTable: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    id: expect.any(Number),
                    name: 'My Table',
                    public: false,
                    users: [
                      {
                        name: 'Bibi Bloxberg',
                        username: 'bibi',
                        role: 'VIEWER',
                      },
                      {
                        name: 'Peter Lustig',
                        username: 'peter',
                        role: 'VIEWER',
                      },
                    ],
                  },
                },
                errors: undefined,
              },
            },
          })
        })
      })

      describe('private meeting exists', () => {
        it('creates new meeting and deletes old one', async () => {
          const userWithMeeting = await findOrCreateUser({
            name: user.name,
            nickname: user.username,
          })

          expect(userWithMeeting).not.toBeNull()

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const oldMeetingID = userWithMeeting.meetingId!

          await expect(
            testServer.executeOperation(
              {
                query: createMyTableMutation,
                variables: {
                  name: 'My Next Table',
                  isPublic: true,
                  userIds: [],
                },
              },
              {
                contextValue: {
                  user: userWithMeeting,
                  dataSources: { prisma },
                },
              },
            ),
          ).resolves.toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: {
                  createMyTable: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    id: expect.any(Number),
                    name: 'My Next Table',
                    public: true,
                    users: [],
                  },
                },
                errors: undefined,
              },
            },
          })

          await expect(
            prisma.meeting.findUnique({ where: { id: oldMeetingID } }),
          ).resolves.toBeNull()
        })
      })
    })

    describe('updateMyTable', () => {
      beforeAll(async () => {
        await prisma.usersInMeetings.deleteMany()
        await prisma.meeting.deleteMany()
      })

      describe('meeting does not exist', () => {
        it('throws meeting does not exist error', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: updateMyTableMutation,
                variables: {
                  name: 'My Table',
                  isPublic: true,
                  userIds: [],
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
                    message: 'User has no meeting!',
                  }),
                ]),
              },
            },
          })
        })
      })

      describe('private meeting exists', () => {
        beforeAll(async () => {
          user = await findOrCreateUser({ nickname, name })
          await testServer.executeOperation(
            {
              query: createMyTableMutation,
              variables: {
                name: 'My Table',
                isPublic: true,
                userIds: [bibiUser.id, peterUser.id],
              },
            },
            {
              contextValue: {
                user,
                dataSources: { prisma },
              },
            },
          )
        })

        it('returns the updated table', async () => {
          user = await findOrCreateUser({ nickname, name })
          await expect(
            testServer.executeOperation(
              {
                query: updateMyTableMutation,
                variables: {
                  name: 'My Updated Table',
                  isPublic: true,
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
                  updateMyTable: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    id: expect.any(Number),
                    name: 'My Updated Table',
                    public: true,
                    users: [],
                  },
                },
                errors: undefined,
              },
            },
          })
        })

        it('has no meeting user mapping left in database', async () => {
          await expect(prisma.usersInMeetings.findMany()).resolves.toHaveLength(0)
        })

        it('creates update my table event', async () => {
          const user = await prisma.user.findUnique({
            where: {
              username: nickname,
            },
          })
          const result = await prisma.event.findMany({
            orderBy: {
              createdAt: 'asc',
            },
          })

          expect(result).toEqual([
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              involvedEmail: null,
              type: 'CREATE_USER',
              involvedUserId: user?.id,
            },
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              involvedEmail: null,
              type: 'CREATE_USER',
              involvedUserId: bibiUser.id,
            },
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              involvedEmail: null,
              type: 'CREATE_USER',
              involvedUserId: peterUser.id,
            },
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              involvedEmail: null,
              type: 'CREATE_USER',
              involvedUserId: raeuberUser.id,
            },
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              involvedEmail: null,
              type: 'CREATE_MY_TABLE',
              involvedUserId: user?.id,
            },
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              involvedEmail: null,
              type: 'CREATE_MY_TABLE',
              involvedUserId: user?.id,
            },
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              involvedEmail: null,
              type: 'CREATE_MY_TABLE',
              involvedUserId: user?.id,
            },
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              involvedEmail: null,
              type: 'CREATE_MY_TABLE',
              involvedUserId: user?.id,
            },
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              involvedEmail: null,
              type: 'CREATE_MY_TABLE',
              involvedUserId: user?.id,
            },
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              involvedEmail: null,
              type: 'UPDATE_MY_TABLE',
              involvedUserId: user?.id,
            },
          ])
        })
      })

      describe('privat meeting exists', () => {
        it('returns the updated table', async () => {
          user = await findOrCreateUser({ nickname, name })
          await expect(
            testServer.executeOperation(
              {
                query: updateMyTableMutation,
                variables: {
                  name: 'My Newly Updated Table',
                  isPublic: false,
                  userIds: [bibiUser.id, peterUser.id],
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
                  updateMyTable: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    id: expect.any(Number),
                    name: 'My Newly Updated Table',
                    public: false,
                    users: [
                      {
                        name: 'Bibi Bloxberg',
                        username: 'bibi',
                        role: 'VIEWER',
                      },
                      {
                        name: 'Peter Lustig',
                        username: 'peter',
                        role: 'VIEWER',
                      },
                    ],
                  },
                },
                errors: undefined,
              },
            },
          })
        })
      })
    })

    describe('joinMyTable', () => {
      beforeAll(async () => {
        await prisma.usersInMeetings.deleteMany()
        await prisma.meeting.deleteMany()
      })

      describe('meeting does not exist', () => {
        it('throws meeting does not exist error', async () => {
          user = {
            ...user,
            meetingId: null,
          }

          await expect(
            testServer.executeOperation(
              {
                query: 'mutation { joinMyTable }',
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
                    message: 'No meeting for user!',
                  }),
                ]),
              },
            },
          })
        })
      })

      describe('meeting exists in DB', () => {
        beforeAll(async () => {
          await testServer.executeOperation(
            {
              query: createMyTableMutation,
              variables: {
                name: 'My Table',
                isPublic: true,
              },
            },
            {
              contextValue: {
                user,
                dataSources: { prisma },
              },
            },
          )
          jest.clearAllMocks()

          joinMeetingLinkMock.mockReturnValue('https://my-link')
          createMeetingMock.mockResolvedValue({
            returncode: 'SUCCESS',
            meetingID: 'xxx',
            internalMeetingID: 'b60d121b438a380c343d5ec3c2037564b82ffef3-1715231322715',
            parentMeetingID: 'bbb-none',
            attendeePW: 'w3VUvMcp',
            moderatorPW: 'MyPp9Zfq',
            createTime: 1718189921310,
            voiceBridge: 255,
            dialNumber: '613-555-1234',
            createDate: new Date(),
            hasUserJoined: false,
            duration: 0,
            hasBeenForciblyEnded: false,
            messageKey: '',
            message: '',
          })
        })

        it('returns id of the table', async () => {
          user = await findOrCreateUser({ nickname, name })
          await expect(
            testServer.executeOperation(
              {
                query: 'mutation { joinMyTable }',
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
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  joinMyTable: expect.any(Number),
                },
                errors: undefined,
              },
            },
          })
        })

        it('updates meeting in database', async () => {
          await expect(
            prisma.user.findFirst({
              where: {
                id: user.id,
              },
              include: {
                meeting: true,
              },
            }),
          ).resolves.toMatchObject({
            meeting: {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              name: 'My Table',
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              meetingID: expect.any(String),
              attendeePW: 'w3VUvMcp',
              moderatorPW: 'MyPp9Zfq',
              voiceBridge: 255,
              dialNumber: '613-555-1234',
              createTime: 1718189921310n,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createDate: expect.any(Date),
            },
          })
        })
      })

      describe('createMeeting returns undefined', () => {
        it('throws meeting error', async () => {
          createMeetingMock.mockResolvedValue(null)
          user = await findOrCreateUser({ nickname, name })
          await expect(
            testServer.executeOperation(
              {
                query: 'mutation { joinMyTable }',
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
                    message: 'Error creating the meeting!',
                  }),
                ]),
              },
            },
          })
        })
      })
    })

    describe('createTable', () => {
      beforeAll(async () => {
        await prisma.usersInMeetings.deleteMany()
        await prisma.meeting.deleteMany()
      })

      describe('meeting does not exist', () => {
        it('returns Table', async () => {
          user = await findOrCreateUser({ nickname, name })
          await expect(
            testServer.executeOperation(
              {
                query: createTableMutation,
                variables: {
                  name: 'Table',
                  isPublic: true,
                  userIds: [bibiUser.id],
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
                  createTable: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    id: expect.any(Number),
                    name: 'Table',
                    public: true,
                    users: [
                      {
                        id: user.id,
                        name: user.name,
                        role: 'MODERATOR',
                      },
                      {
                        id: bibiUser.id,
                        name: bibiUser.name,
                        role: 'MODERATOR',
                      },
                    ],
                  },
                },
                errors: undefined,
              },
            },
          })
        })

        it('creates meeting in database', async () => {
          await expect(
            prisma.meeting.findFirst({
              where: {
                user: null,
                users: {
                  some: {
                    OR: [
                      {
                        userId: user.id,
                      },
                      {
                        userId: bibiUser.id,
                      },
                    ],
                  },
                },
              },
              include: {
                users: true,
              },
            }),
          ).resolves.toMatchObject({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: expect.any(Number),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            meetingID: expect.any(String),
            name: 'Table',
            public: true,
          })
        })

        it('creates create table event in the database', async () => {
          const user = await prisma.user.findUnique({
            where: {
              username: nickname,
            },
          })
          const result = await prisma.event.findMany({
            orderBy: {
              createdAt: 'asc',
            },
          })
          expect(result).toEqual([
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              involvedEmail: null,
              type: 'CREATE_USER',
              involvedUserId: user?.id,
            },
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              involvedEmail: null,
              type: 'CREATE_USER',
              involvedUserId: bibiUser.id,
            },
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              involvedEmail: null,
              type: 'CREATE_USER',
              involvedUserId: peterUser.id,
            },
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              involvedEmail: null,
              type: 'CREATE_USER',
              involvedUserId: raeuberUser.id,
            },
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              involvedEmail: null,
              type: 'CREATE_MY_TABLE',
              involvedUserId: user?.id,
            },
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              involvedEmail: null,
              type: 'CREATE_MY_TABLE',
              involvedUserId: user?.id,
            },
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              involvedEmail: null,
              type: 'CREATE_MY_TABLE',
              involvedUserId: user?.id,
            },
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              involvedEmail: null,
              type: 'CREATE_MY_TABLE',
              involvedUserId: user?.id,
            },
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              involvedEmail: null,
              type: 'CREATE_MY_TABLE',
              involvedUserId: user?.id,
            },
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              involvedEmail: null,
              type: 'UPDATE_MY_TABLE',
              involvedUserId: user?.id,
            },
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              involvedEmail: null,
              type: 'UPDATE_MY_TABLE',
              involvedUserId: user?.id,
            },
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              involvedEmail: null,
              type: 'CREATE_MY_TABLE',
              involvedUserId: user?.id,
            },
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              createdAt: expect.any(Date),
              involvedEmail: null,
              type: 'CREATE_TABLE',
              involvedUserId: user?.id,
            },
          ])
        })
      })

      describe('meeting exists', () => {
        // Need to define if we want to have a throw if meeting already exists
        it.skip('throws meeting exists error', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: createTableMutation,
                variables: {
                  name: 'Table',
                  isPublic: true,
                  userIds: [bibiUser.id],
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
                    message: 'Meeting already exists!',
                  }),
                ]),
              },
            },
          })
        })
      })

      describe('public table without given users', () => {
        it('returns table with creating user as moderator', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: createTableMutation,
                variables: {
                  name: 'Own Group Table',
                  isPublic: true,
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
                  createTable: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    id: expect.any(Number),
                    name: 'Own Group Table',
                    public: true,
                    users: [
                      {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        id: expect.any(Number),
                        name: user.name,
                        role: 'MODERATOR',
                      },
                    ],
                  },
                },
                errors: undefined,
              },
            },
          })
        })
      })

      describe('private meeting', () => {
        it('returns table with users', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: createTableMutation,
                variables: {
                  name: 'Table',
                  isPublic: false,
                  userIds: [bibiUser.id, peterUser.id],
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
                  createTable: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    id: expect.any(Number),
                    name: 'Table',
                    public: false,
                    users: [
                      {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        id: expect.any(Number),
                        name: user.name,
                        role: 'MODERATOR',
                      },
                      {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        id: expect.any(Number),
                        name: 'Bibi Bloxberg',
                        role: 'MODERATOR',
                      },
                      {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        id: expect.any(Number),
                        name: 'Peter Lustig',
                        role: 'MODERATOR',
                      },
                    ],
                  },
                },
                errors: undefined,
              },
            },
          })
        })
      })
    })

    describe('joinTable', () => {
      const query = `
        query ($tableId: Int!) {
          joinTable(tableId: $tableId)
        }
      `

      describe('no table in DB', () => {
        it('throws an Error', async () => {
          await expect(
            testServer.executeOperation(
              {
                query,
                variables: {
                  tableId: -1,
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
                errors: [expect.objectContaining({ message: 'Table does not exist' })],
              },
            },
          })
        })
      })

      describe('table in DB', () => {
        let tableId: number

        beforeAll(async () => {
          await prisma.usersInMeetings.deleteMany()
          await prisma.meeting.deleteMany()
          const meeting = await prisma.meeting.create({
            data: {
              name: 'Pony Ville',
              meetingID: 'Pony Ville',
              attendeePW: 'attendee',
              moderatorPW: 'moderator',
            },
          })
          tableId = meeting.id
        })

        describe('current user does not own the opened public table', () => {
          beforeAll(() => {
            joinMeetingLinkMock.mockReturnValue('https://my-link')
          })

          it('returns link to table', async () => {
            await expect(
              testServer.executeOperation(
                {
                  query,
                  variables: {
                    tableId,
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
                  data: { joinTable: 'https://my-link' },
                  errors: undefined,
                },
              },
            })
          })

          it('calls join meeting link with attendee pw', async () => {
            await testServer.executeOperation(
              {
                query,
                variables: {
                  tableId,
                },
              },
              {
                contextValue: {
                  user,
                  dataSources: { prisma },
                },
              },
            )

            expect(joinMeetingLinkMock).toHaveBeenCalledWith({
              fullName: 'User',
              meetingID: 'Pony Ville',
              password: 'attendee',
            })
          })
        })

        describe('current user is owner of the table', () => {
          beforeAll(async () => {
            joinMeetingLinkMock.mockReturnValue('https://my-link')
            createMeetingMock.mockResolvedValue({
              returncode: 'SUCCESS',
              meetingID: 'xxx',
              internalMeetingID: 'b60d121b438a380c343d5ec3c2037564b82ffef3-1715231322715',
              parentMeetingID: 'bbb-none',
              attendeePW: 'attendee',
              moderatorPW: 'moderator',
              createTime: 1718189921310,
              voiceBridge: 255,
              dialNumber: '613-555-1234',
              createDate: new Date(),
              hasUserJoined: false,
              duration: 0,
              hasBeenForciblyEnded: false,
              messageKey: '',
              message: '',
            })
            await prisma.user.update({
              where: {
                username: user.username,
              },
              data: {
                meetingId: tableId,
              },
            })
          })

          afterAll(async () => {
            await prisma.user.update({
              where: {
                username: user.username,
              },
              data: {
                meetingId: null,
              },
            })
          })

          it('calls join meeting link with moderator pw', async () => {
            await testServer.executeOperation(
              {
                query,
                variables: {
                  tableId,
                },
              },
              {
                contextValue: {
                  user,
                  dataSources: { prisma },
                },
              },
            )

            expect(joinMeetingLinkMock).toHaveBeenCalledWith({
              fullName: 'User',
              meetingID: 'Pony Ville',
              password: 'moderator',
            })
          })
        })

        describe('current user is attendee of a closed public meeting', () => {
          beforeAll(async () => {
            await prisma.meeting.update({
              where: {
                id: tableId,
              },
              data: {
                attendeePW: null,
              },
            })
          })

          afterAll(async () => {
            await prisma.meeting.update({
              where: {
                id: tableId,
              },
              data: {
                attendeePW: 'attendee',
              },
            })
          })

          it('throws an error that the meeting does not exists', async () => {
            await expect(
              testServer.executeOperation(
                {
                  query,
                  variables: {
                    tableId,
                  },
                },
                {
                  contextValue: {
                    user: peterUser,
                    dataSources: { prisma },
                  },
                },
              ),
            ).resolves.toMatchObject({
              body: {
                kind: 'single',
                singleResult: {
                  data: null,
                  errors: [expect.objectContaining({ message: 'This meeting does not exists.' })],
                },
              },
            })
          })
        })

        describe('current user is moderator of the table', () => {
          beforeAll(async () => {
            jest.clearAllMocks()

            joinMeetingLinkMock.mockReturnValue('https://my-link')
            const userIds = [user.id, bibiUser.id]

            for (const userId of userIds) {
              await prisma.usersInMeetings.create({
                data: {
                  userId,
                  meetingId: tableId,
                  role: AttendeeRole.MODERATOR,
                },
              })
            }
          })

          it('calls join meeting link with moderator pw', async () => {
            await testServer.executeOperation(
              {
                query,
                variables: {
                  tableId,
                },
              },
              {
                contextValue: {
                  user,
                  dataSources: { prisma },
                },
              },
            )

            expect(joinMeetingLinkMock).toHaveBeenCalledWith({
              fullName: 'User',
              meetingID: 'Pony Ville',
              password: 'moderator',
            })
          })

          it('calls join meeting link with moderator pw for bibi', async () => {
            await testServer.executeOperation(
              {
                query,
                variables: {
                  tableId,
                },
              },
              {
                contextValue: {
                  user: bibiUser,
                  dataSources: { prisma },
                },
              },
            )

            expect(joinMeetingLinkMock).toHaveBeenCalledWith({
              fullName: 'Bibi Bloxberg',
              meetingID: 'Pony Ville',
              password: 'moderator',
            })
          })

          it('calls join meeting link with attendee pw for peter', async () => {
            await testServer.executeOperation(
              {
                query,
                variables: {
                  tableId,
                },
              },
              {
                contextValue: {
                  user: peterUser,
                  dataSources: { prisma },
                },
              },
            )

            expect(joinMeetingLinkMock).toHaveBeenCalledWith({
              fullName: 'Peter Lustig',
              meetingID: 'Pony Ville',
              password: 'attendee',
            })
          })
        })

        describe('meeting is private', () => {
          beforeAll(async () => {
            await prisma.meeting.update({
              where: {
                id: tableId,
              },
              data: {
                public: false,
              },
            })
          })

          it('throws an exeption for an unknown user', async () => {
            await expect(
              testServer.executeOperation(
                {
                  query,
                  variables: {
                    tableId,
                  },
                },
                {
                  contextValue: {
                    user: raeuberUser,
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
                      message: 'User has no access to meeting.',
                    }),
                  ]),
                },
              },
            })
          })
        })
      })
    })

    describe('openTables', () => {
      describe('no meetings', () => {
        beforeEach(() => {
          getMeetingsMock.mockResolvedValue([])
        })

        it('returns empty array', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: 'query { openTables { meetingName } }',
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
                data: { openTables: [] },
                errors: undefined,
              },
            },
          })
        })
      })

      describe('meeting is not in database', () => {
        beforeEach(() => {
          getMeetingsMock.mockResolvedValue([
            {
              meetingName: 'Dreammall Entwicklung',
              meetingID: 'Dreammall-Entwicklung',
              internalMeetingID: '258ea7269760758304b6b8494f17e9bf69dc1efe-1718189921310',
              createTime: 1718189921310,
              createDate: new Date('Wed Jun 12 10:58:41 UTC 2024'),
              voiceBridge: 96378,
              dialNumber: '613-555-1234',
              attendeePW: 'MqgUFwdD',
              moderatorPW: 'mTtxYGo2',
              running: true,
              duration: 0,
              hasUserJoined: true,
              recording: false,
              hasBeenForciblyEnded: false,
              startTime: 1718189,
              endTime: 0,
              participantCount: 0,
              listenerCount: 1,
              voiceParticipantCount: 0,
              videoCount: 0,
              maxUsers: 0,
              moderatorCount: 1,
              attendees: '',
              metadata: '',
              isBreakout: false,
            },
          ])
        })

        it('returns empty array', async () => {
          await expect(
            testServer.executeOperation(
              {
                query:
                  'query { openTables { id meetingName meetingID participantCount startTime attendees { fullName } } }',
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
                  openTables: [],
                },
                errors: undefined,
              },
            },
          })
        })
      })

      describe('one attendee and meeting in DB', () => {
        beforeAll(async () => {
          await prisma.meeting.create({
            data: {
              name: 'Dreammall Entwicklung',
              meetingID: 'Dreammall-Entwicklung',
              attendeePW: '1234',
            },
          })
        })

        beforeEach(() => {
          getMeetingsMock.mockResolvedValue([
            {
              meetingName: 'Dreammall Entwicklung',
              meetingID: 'Dreammall-Entwicklung',
              internalMeetingID: '258ea7269760758304b6b8494f17e9bf69dc1efe-1718189921310',
              createTime: 1718189921310,
              createDate: new Date('Wed Jun 12 10:58:41 UTC 2024'),
              voiceBridge: 96378,
              dialNumber: '613-555-1234',
              attendeePW: 'MqgUFwdD',
              moderatorPW: 'mTtxYGo2',
              running: true,
              duration: 0,
              hasUserJoined: true,
              recording: false,
              hasBeenForciblyEnded: false,
              startTime: 1718189,
              endTime: 0,
              participantCount: 0,
              listenerCount: 1,
              voiceParticipantCount: 0,
              videoCount: 0,
              maxUsers: 0,
              moderatorCount: 1,
              attendees: {
                attendee: {
                  userID: '1234',
                  fullName: 'Peter Lustig',
                  role: 'moderator',
                  isPresenter: false,
                  isListeningOnly: false,
                  hasJoinedVoice: true,
                  hasVideo: true,
                  clientType: 'html5',
                },
              },
              metadata: '',
              isBreakout: false,
            },
          ])
        })

        it('returns table with attendee', async () => {
          jest.clearAllMocks()
          await expect(
            testServer.executeOperation(
              {
                query:
                  'query { openTables { id meetingName meetingID participantCount startTime attendees { fullName } } }',
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
                  openTables: [
                    {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      id: expect.any(Number),
                      meetingName: 'Dreammall Entwicklung',
                      meetingID: 'Dreammall-Entwicklung',
                      participantCount: 0,
                      startTime: '1718189',
                      attendees: [
                        {
                          fullName: 'Peter Lustig',
                        },
                      ],
                    },
                  ],
                },
                errors: undefined,
              },
            },
          })
        })
      })

      describe('some attendee', () => {
        beforeEach(() => {
          getMeetingsMock.mockResolvedValue([
            {
              meetingName: 'Dreammall Entwicklung',
              meetingID: 'Dreammall-Entwicklung',
              internalMeetingID: '258ea7269760758304b6b8494f17e9bf69dc1efe-1718189921310',
              createTime: 1718189921310,
              createDate: new Date('Wed Jun 12 10:58:41 UTC 2024'),
              voiceBridge: 96378,
              dialNumber: '613-555-1234',
              attendeePW: 'MqgUFwdD',
              moderatorPW: 'mTtxYGo2',
              running: true,
              duration: 0,
              hasUserJoined: true,
              recording: false,
              hasBeenForciblyEnded: false,
              startTime: 1718189,
              endTime: 0,
              participantCount: 0,
              listenerCount: 1,
              voiceParticipantCount: 0,
              videoCount: 0,
              maxUsers: 0,
              moderatorCount: 1,
              attendees: {
                attendee: [
                  {
                    userID: '1234',
                    fullName: 'Peter Lustig',
                    role: 'moderator',
                    isPresenter: false,
                    isListeningOnly: false,
                    hasJoinedVoice: true,
                    hasVideo: true,
                    clientType: 'html5',
                  },
                  {
                    userID: '4321',
                    fullName: 'Bibi Bloxberg',
                    role: 'attendee',
                    isPresenter: false,
                    isListeningOnly: false,
                    hasJoinedVoice: true,
                    hasVideo: true,
                    clientType: 'html5',
                  },
                ],
              },
              metadata: '',
              isBreakout: false,
            },
          ])
        })

        it('returns table with all attendees', async () => {
          await expect(
            testServer.executeOperation(
              {
                query:
                  'query { openTables { id meetingName meetingID participantCount startTime attendees { fullName } } }',
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
                  openTables: [
                    {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      id: expect.any(Number),
                      meetingName: 'Dreammall Entwicklung',
                      meetingID: 'Dreammall-Entwicklung',
                      participantCount: 0,
                      startTime: '1718189',
                      attendees: [
                        {
                          fullName: 'Peter Lustig',
                        },
                        {
                          fullName: 'Bibi Bloxberg',
                        },
                      ],
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

    describe('tables', () => {
      it('returns empty array for tables where user is owner', async () => {
        await expect(
          testServer.executeOperation(
            {
              query: tablesQuery,
            },
            { contextValue: { user: raeuberUser, dataSources: { prisma } } },
          ),
        ).resolves.toMatchObject({
          body: {
            kind: 'single',
            singleResult: {
              data: {
                tables: [],
              },
              errors: undefined,
            },
          },
        })
      })

      describe('setup myTables', () => {
        beforeEach(async () => {
          await testServer.executeOperation(
            {
              query: createMyTableMutation,
              variables: {
                name: 'My Table',
                isPublic: true,
              },
            },
            {
              contextValue: {
                user: raeuberUser,
                dataSources: { prisma },
              },
            },
          )
        })

        it('returns array for tables where user is owner', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: tablesQuery,
              },
              { contextValue: { user: raeuberUser, dataSources: { prisma } } },
            ),
          ).resolves.toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: {
                  tables: [
                    {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      id: expect.any(Number),
                      name: 'My Table',
                      public: true,
                      users: [],
                    },
                  ],
                },
                errors: undefined,
              },
            },
          })
        })
      })

      describe('setup tables', () => {
        beforeEach(async () => {
          await testServer.executeOperation(
            {
              query: createTableMutation,
              variables: {
                name: 'Table',
                isPublic: true,
                userIds: [bibiUser.id],
              },
            },
            {
              contextValue: {
                user: raeuberUser,
                dataSources: { prisma },
              },
            },
          )
        })

        it('returns array for tables where user is owner', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: tablesQuery,
              },
              { contextValue: { user: raeuberUser, dataSources: { prisma } } },
            ),
          ).resolves.toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: {
                  tables: [
                    {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      id: expect.any(Number),
                      name: 'My Table',
                      public: true,
                      users: [],
                    },
                    {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      id: expect.any(Number),
                      name: 'Table',
                      public: true,
                      users: [
                        {
                          id: bibiUser.id,
                          name: bibiUser.name,
                          role: AttendeeRole.MODERATOR,
                        },
                        {
                          id: raeuberUser.id,
                          name: raeuberUser.name,
                          role: AttendeeRole.MODERATOR,
                        },
                      ],
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

    describe('deleteTable', () => {
      it('throws an error for non existing tableId', async () => {
        await expect(
          testServer.executeOperation(
            {
              query: deleteTableMutation,
              variables: {
                tableId: -1,
              },
            },
            {
              contextValue: {
                user: raeuberUser,
                dataSources: { prisma },
              },
            },
          ),
        ).resolves.toMatchObject({
          body: {
            kind: 'single',
            singleResult: {
              data: null,
              errors: [expect.objectContaining({ message: 'Meeting not found!' })],
            },
          },
        })
      })

      describe('existing table with multiple', () => {
        let tableId: number | undefined
        beforeAll(async () => {
          const meeting = await prisma.meeting.findFirst({
            where: {
              users: {
                some: {
                  userId: raeuberUser.id,
                  role: AttendeeRole.MODERATOR,
                },
              },
            },
          })
          tableId = meeting?.id
        })

        it('delete the connection of table to user', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: deleteTableMutation,
                variables: {
                  tableId,
                },
              },
              {
                contextValue: {
                  user: raeuberUser,
                  dataSources: { prisma },
                },
              },
            ),
          ).resolves.toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: {
                  deleteTable: true,
                },
              },
            },
          })
          await expect(
            prisma.usersInMeetings.findFirst({
              where: {
                meetingId: tableId,
                userId: raeuberUser.id,
              },
            }),
          ).resolves.toBeNull()
        })

        it('throws error for already deleted connection', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: deleteTableMutation,
                variables: {
                  tableId,
                },
              },
              {
                contextValue: {
                  user: raeuberUser,
                  dataSources: { prisma },
                },
              },
            ),
          ).resolves.toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: null,
                errors: [expect.objectContaining({ message: 'User could not be detached.' })],
              },
            },
          })
        })
      })

      describe('existing table with one MODERATOR', () => {
        let tableId: number | undefined
        beforeAll(async () => {
          const meeting = await prisma.meeting.create({
            data: {
              meetingID: 'Räuber Group',
              name: 'Räuber Group',
              users: {
                create: {
                  userId: raeuberUser.id,
                },
              },
            },
          })
          tableId = meeting.id
        })

        it('throws error no other Moderator in table', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: deleteTableMutation,
                variables: {
                  tableId,
                },
              },
              {
                contextValue: {
                  user: raeuberUser,
                  dataSources: { prisma },
                },
              },
            ),
          ).resolves.toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: null,
                errors: [
                  expect.objectContaining({
                    message: 'There is no other Moderator in this table.',
                  }),
                ],
              },
            },
          })
        })
      })
    })
  })
})
