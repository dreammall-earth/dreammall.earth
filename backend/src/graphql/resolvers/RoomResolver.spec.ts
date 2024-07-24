import { ApolloServer } from '@apollo/server'
import { User } from '@prisma/client'

import { createMeeting, joinMeetingLink, getMeetings } from '#api/BBB'
import { CONFIG } from '#config/config'
import { prisma } from '#src/prisma'
import { createTestServer } from '#src/server/server'

import type { Context } from '#src/server/context'

jest.mock('#api/BBB')

const createMeetingMock = jest.mocked(createMeeting)
const joinMeetingLinkMock = jest.mocked(joinMeetingLink)
const getMeetingsMock = jest.mocked(getMeetings)

let testServer: ApolloServer<Context>

CONFIG.FRONTEND_INVITE_LINK_URL = '/'

const createMyRoomMutation = `mutation($name: String!, $isPublic: Boolean!, $userIds: [Int]) {
  createMyRoom(name: $name, isPublic: $isPublic, userIds: $userIds) {
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

const updateMyRoomMutation = `mutation($name: String!, $isPublic: Boolean!, $userIds: [Int]) {
  updateMyRoom(name: $name, isPublic: $isPublic, userIds: $userIds) {
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

describe('RoomResolver', () => {
  beforeAll(async () => {
    testServer = await createTestServer()
  })

  describe('unauthorized', () => {
    describe('createMyRoom', () => {
      it('throws access denied', async () => {
        await expect(
          testServer.executeOperation(
            {
              query: createMyRoomMutation,
              variables: {
                name: 'My Room',
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

    describe('updateMyRoom', () => {
      it('throws access denied', async () => {
        await expect(
          testServer.executeOperation(
            {
              query: updateMyRoomMutation,
              variables: {
                name: 'My Room',
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

    describe('joinMyRoom', () => {
      it('throws access denied', async () => {
        await expect(
          testServer.executeOperation(
            {
              query: 'mutation { joinMyRoom }',
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

    describe('openRooms', () => {
      it('throws access denied', async () => {
        await expect(
          testServer.executeOperation(
            {
              query: 'query { openRooms { meetingName } }',
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

    describe('joinRoom', () => {
      const query = `
        query ($roomId: Int!, $userName: String!) {
          joinRoom(roomId: $roomId, userName: $userName)
        }
      `
      describe('No room in DB', () => {
        it('throws an Error', async () => {
          await expect(
            testServer.executeOperation(
              {
                query,
                variables: {
                  userName: 'Pinky Pie',
                  roomId: 25,
                },
              },
              { contextValue: { dataSources: { prisma } } },
            ),
          ).resolves.toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: null,
                errors: [expect.objectContaining({ message: 'Room does not exist' })],
              },
            },
          })
        })
      })

      describe('room in DB', () => {
        let roomId: number
        beforeEach(async () => {
          joinMeetingLinkMock.mockReturnValue('https://my-link')
          const meeting = await prisma.meeting.create({
            data: {
              name: 'Pony Ville',
              meetingID: 'Pony Ville',
            },
          })
          roomId = meeting.id
        })

        afterEach(async () => {
          await prisma.meeting.deleteMany()
        })

        it('returns link to room', async () => {
          await expect(
            testServer.executeOperation(
              {
                query,
                variables: {
                  userName: 'Pinky Pie',
                  roomId,
                },
              },
              { contextValue: { dataSources: { prisma } } },
            ),
          ).resolves.toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: { joinRoom: 'https://my-link' },

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
                roomId,
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
    describe('createMyRoom', () => {
      describe('meeting does not exist', () => {
        it('returns Room', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: createMyRoomMutation,
                variables: {
                  name: 'My Room',
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
                  createMyRoom: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    id: expect.any(Number),
                    name: 'My Room',
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
              name: 'My Room',
              public: true,
            },
          })
        })
      })

      describe('meeting exists', () => {
        it('throws meeting exists error', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: createMyRoomMutation,
                variables: {
                  name: 'My Room',
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

        it('returns room with users', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: createMyRoomMutation,
                variables: {
                  name: 'My Room',
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
                  createMyRoom: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    id: expect.any(Number),
                    name: 'My Room',
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

    describe('updateMyRoom', () => {
      beforeAll(async () => {
        await prisma.usersInMeetings.deleteMany()
        await prisma.meeting.deleteMany()
        await prisma.user.deleteMany()
      })

      let bibi: User | undefined
      let peter: User | undefined

      describe('meeting does not exist', () => {
        it('throws meeting does not exist error', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: updateMyRoomMutation,
                variables: {
                  name: 'My Room',
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
              query: createMyRoomMutation,
              variables: {
                name: 'My Room',
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

        it('returns the updated room', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: updateMyRoomMutation,
                variables: {
                  name: 'My Updated Room',
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
                  updateMyRoom: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    id: expect.any(Number),
                    name: 'My Updated Room',
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
      })

      describe('privat meeting exists', () => {
        it('returns the updated room', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: updateMyRoomMutation,
                variables: {
                  name: 'My Newly Updated Room',
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
                  updateMyRoom: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    id: expect.any(Number),
                    name: 'My Newly Updated Room',
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

    describe('joinMyRoom', () => {
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
                query: 'mutation { joinMyRoom }',
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
              query: createMyRoomMutation,
              variables: {
                name: 'My Room',
                isPublic: true,
              },
            },
            {
              contextValue: {
                token: 'token',
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

        it('returns link to room', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: 'mutation { joinMyRoom }',
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
                  joinMyRoom: 'https://my-link',
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
                query: 'mutation { joinMyRoom }',
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

    describe('openRooms', () => {
      describe('no meetings', () => {
        beforeEach(() => {
          getMeetingsMock.mockResolvedValue([])
        })

        it('returns empty array', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: 'query { openRooms { meetingName } }',
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
                data: { openRooms: [] },
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
                  'query { openRooms { meetingName meetingID participantCount startTime joinLink attendees { fullName } } }',
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
                  openRooms: [
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

        it('returns room with attendee', async () => {
          jest.clearAllMocks()
          await expect(
            testServer.executeOperation(
              {
                query:
                  'query { openRooms { meetingName meetingID participantCount startTime joinLink attendees { fullName } } }',
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
                  openRooms: [
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
                  'query { openRooms { meetingName meetingID participantCount startTime joinLink attendees { fullName } } }',
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
                  openRooms: [
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
