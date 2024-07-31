import { ApolloServer } from '@apollo/server'
import { User } from '@prisma/client'

import { createMeeting, joinMeetingLink, getMeetings } from '#api/BBB'
import { CONFIG } from '#config/config'
import { fakePayload } from '#src/auth/jwtVerify'
import { prisma } from '#src/prisma'
import { createTestServer } from '#src/server/server'

import type { Context } from '#src/server/context'

jest.mock('#api/BBB')

const createMeetingMock = jest.mocked(createMeeting)
const joinMeetingLinkMock = jest.mocked(joinMeetingLink)
const getMeetingsMock = jest.mocked(getMeetings)

let testServer: ApolloServer<Context>

CONFIG.FRONTEND_INVITE_LINK_URL = '/'

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
            { contextValue: { dataSources: { prisma } } },
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
            { contextValue: { dataSources: { prisma } } },
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
            { contextValue: { dataSources: { prisma } } },
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
            { contextValue: { dataSources: { prisma } } },
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
        query ($tableId: Int!, $userName: String!) {
          joinTable(tableId: $tableId, userName: $userName)
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
              { contextValue: { dataSources: { prisma } } },
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
              { contextValue: { dataSources: { prisma } } },
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

        it('calls join meeting link', async () => {
          await testServer.executeOperation(
            {
              query,
              variables: {
                userName: 'Pinky Pie',
                tableId,
              },
            },
            { contextValue: { dataSources: { prisma } } },
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
              username: fakePayload.nickname,
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
                  token: 'token',
                  user: undefined,
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
                  token: 'token',
                  user: undefined,
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
                token: 'token',
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
              username: fakePayload.nickname,
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

      let meetingId: string | undefined

      describe('meeting does not exist', () => {
        beforeEach(() => {
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

        it('returns link to table', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: 'mutation { joinMyTable }',
              },
              {
                contextValue: {
                  token: 'token',
                  user: undefined,
                  dataSources: { prisma },
                },
              },
            ),
          ).resolves.toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: {
                  joinMyTable: 'https://my-link',
                },
                errors: undefined,
              },
            },
          })
        })

        it('creates meeting in database and calls createMeeting', async () => {
          const result = await prisma.user.findFirst({
            include: {
              meeting: true,
            },
          })
          meetingId = result?.meeting?.meetingID
          expect(result).toMatchObject({
            meeting: {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              name: 'mockedUser',
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
          expect(createMeetingMock).toHaveBeenCalledWith(
            {
              name: 'mockedUser',
              meetingID: result?.meeting?.meetingID,
            },
            {
              moderatorOnlyMessage: `Use this link to invite more people:<br/>/${result?.meeting?.id}`,
            },
          )
        })
      })

      describe('meeting exists in DB', () => {
        beforeAll(() => {
          jest.clearAllMocks()
        })

        beforeEach(() => {
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

        it('returns link to table', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: 'mutation { joinMyTable }',
              },
              {
                contextValue: {
                  token: 'token',
                  user: undefined,
                  dataSources: { prisma },
                },
              },
            ),
          ).resolves.toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: {
                  joinMyTable: 'https://my-link',
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
              name: 'mockedUser',
              meetingID: meetingId,
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
                    message: 'Could not create meeting!',
                  }),
                ]),
              },
            },
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
                  token: 'token',
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

      describe('no attendees', () => {
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
                  'query { openTables { meetingName meetingID participantCount startTime joinLink attendees { fullName } } }',
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
                  openTables: [
                    {
                      meetingName: 'Dreammall Entwicklung',
                      meetingID: 'Dreammall-Entwicklung',
                      participantCount: 0,
                      startTime: '1718189',
                      attendees: [],
                      joinLink: 'https://my-link',
                    },
                  ],
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
                  'query { openTables { meetingName meetingID participantCount startTime joinLink attendees { fullName } } }',
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
                  openTables: [
                    {
                      meetingName: 'Dreammall Entwicklung',
                      meetingID: 'Dreammall-Entwicklung',
                      participantCount: 0,
                      startTime: '1718189',
                      joinLink: 'https://my-link',
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

        it('calls joinMeetingLink with correct PW', () => {
          expect(joinMeetingLinkMock).toHaveBeenCalledWith({
            fullName: 'User',
            meetingID: 'Dreammall-Entwicklung',
            password: '1234',
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

        it('returns empty array', async () => {
          await expect(
            testServer.executeOperation(
              {
                query:
                  'query { openTables { meetingName meetingID participantCount startTime joinLink attendees { fullName } } }',
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
                  openTables: [
                    {
                      meetingName: 'Dreammall Entwicklung',
                      meetingID: 'Dreammall-Entwicklung',
                      participantCount: 0,
                      startTime: '1718189',
                      joinLink: 'https://my-link',
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
