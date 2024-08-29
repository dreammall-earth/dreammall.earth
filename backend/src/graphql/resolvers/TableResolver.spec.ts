import { ApolloServer } from '@apollo/server'
import { User } from '@prisma/client'

import { createMeeting, joinMeetingLink, getMeetings } from '#api/BBB'
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
  })

  describe('authorized', () => {
    let user: UserWithProfile
    beforeEach(async () => {
      user = await findOrCreateUser({ nickname, name })
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
              type: 'CREATE_MY_TABLE',
              involvedUserId: user?.id,
            },
          ])
        })
      })

      describe('meeting exists', () => {
        it('throws meeting exists error', async () => {
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

      describe('private meeting', () => {
        let bibi: User | undefined
        let peter: User | undefined

        beforeAll(async () => {
          // await prisma.usersInMeetings.deleteMany()
          await prisma.meeting.deleteMany()

          bibi = await prisma.user.create({
            data: {
              username: 'bibi',
              name: 'Bibi Bloxberg',
            },
          })

          peter = await prisma.user.create({
            data: {
              username: 'peter',
              name: 'Peter Lustig',
            },
          })
        })

        it('returns table with users', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: createMyTableMutation,
                variables: {
                  name: 'My Table',
                  isPublic: false,
                  userIds: [bibi?.id, peter?.id],
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
    })

    describe('updateMyTable', () => {
      beforeAll(async () => {
        await prisma.usersInMeetings.deleteMany()
        await prisma.meeting.deleteMany()
        await prisma.user.deleteMany()
        await prisma.event.deleteMany()
      })

      let bibi: User | undefined
      let peter: User | undefined

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
          bibi = await prisma.user.create({
            data: {
              username: 'bibi',
              name: 'Bibi Bloxberg',
            },
          })

          peter = await prisma.user.create({
            data: {
              username: 'peter',
              name: 'Peter Lustig',
            },
          })

          await testServer.executeOperation(
            {
              query: createMyTableMutation,
              variables: {
                name: 'My Table',
                isPublic: true,
                userIds: [bibi?.id, peter?.id],
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

        it('creates update my room event', async () => {
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
          await expect(
            testServer.executeOperation(
              {
                query: updateMyTableMutation,
                variables: {
                  name: 'My Newly Updated Table',
                  isPublic: false,
                  userIds: [bibi?.id, peter?.id],
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
        await prisma.user.deleteMany()
      })

      describe('meeting does not exist', () => {
        it('throws meeting does not exist error', async () => {
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
                name: 'My Room',
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
              include: {
                meeting: true,
              },
            }),
          ).resolves.toMatchObject({
            meeting: {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              name: 'My Room',
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
      let bibi: User | undefined
      let peter: User | undefined

      beforeAll(async () => {
        await prisma.usersInMeetings.deleteMany()
        await prisma.meeting.deleteMany()

        bibi = await prisma.user.create({
          data: {
            username: 'bibi',
            name: 'Bibi Bloxberg',
          },
        })

        peter = await prisma.user.create({
          data: {
            username: 'peter',
            name: 'Peter Lustig',
          },
        })
      })

      describe('meeting does not exist', () => {
        it('returns Table', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: createTableMutation,
                variables: {
                  name: 'Table',
                  isPublic: true,
                  userIds: [bibi?.id],
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
                        id: bibi?.id,
                        name: bibi?.name,
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

        it.skip('creates meeting in database', async () => {
          await expect(
            prisma.meeting.findFirst({
              where: {
                user: null,
                users: {
                  some: {
                    userId: {
                      // in: [bibi?.id, user.id],
                    },
                  },
                },
              },
              include: {
                users: true,
              },
            }),
          ).resolves.toMatchObject({
            meeting: {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              meetingID: expect.any(String),
              name: 'Table',
              public: true,
            },
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
          expect(result).toMatchObject(
            expect.arrayContaining([
              expect.objectContaining({
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                id: expect.any(Number),
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                createdAt: expect.any(Date),
                involvedEmail: null,
                type: 'CREATE_USER',
                involvedUserId: user?.id,
              }),
              expect.objectContaining({
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                id: expect.any(Number),
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                createdAt: expect.any(Date),
                involvedEmail: null,
                type: 'CREATE_TABLE',
                involvedUserId: user?.id,
              }),
            ]),
          )
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
                  userIds: [bibi?.id],
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

      describe('private meeting', () => {
        it('returns table with users', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: createTableMutation,
                variables: {
                  name: 'Table',
                  isPublic: false,
                  userIds: [bibi?.id, peter?.id],
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
                  tableId: 25,
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
        afterEach(async () => {
          await prisma.usersInMeetings.deleteMany()
          await prisma.meeting.deleteMany()
        })

        let tableId: number

        describe('current user does not own the table', () => {
          beforeEach(async () => {
            joinMeetingLinkMock.mockReturnValue('https://my-link')
            const meeting = await prisma.meeting.create({
              data: {
                name: 'Pony Ville',
                meetingID: 'Pony Ville',
                attendeePW: 'attendee',
              },
            })
            tableId = meeting.id
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
          beforeEach(async () => {
            joinMeetingLinkMock.mockReturnValue('https://my-link')
            const meeting = await prisma.meeting.create({
              data: {
                name: 'Pony Ville',
                meetingID: 'Pony Ville',
                attendeePW: 'attendee',
                moderatorPW: 'moderator',
              },
            })
            tableId = meeting.id
            await prisma.user.update({
              where: {
                username: 'mockedUser',
              },
              data: {
                meetingId: tableId,
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
  })
})
