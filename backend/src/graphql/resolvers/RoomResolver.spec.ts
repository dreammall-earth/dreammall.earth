import { ApolloServer } from '@apollo/server'
// eslint-disable-next-line n/no-unpublished-import
import { gql } from 'graphql-tag'

import { createMeeting, joinMeetingLink } from '#api/BBB'
import { prisma } from '#src/prisma'
import { createTestServer } from '#src/server/server'

jest.mock('#api/BBB')

const createMeetingMock = createMeeting as jest.MockedFunction<typeof createMeeting>
const joinMeetingLinkMock = joinMeetingLink as jest.MockedFunction<typeof joinMeetingLink>

let testServer: ApolloServer

beforeAll(async () => {
  testServer = await createTestServer()
})

describe('RoomResolver', () => {
  describe('unauthorized', () => {
    describe('createMyRoom', () => {
      it('throws access denied', async () => {
        await expect(
          testServer.executeOperation({
            query: 'mutation($name: String!) { createMyRoom(name: $name) { id } }',
            variables: { name: 'My Room' },
          }),
        ).resolves.toMatchObject({
          body: {
            kind: 'single',
            singleResult: {
              data: { createMyRoom: null },
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
          testServer.executeOperation({
            query: 'query { joinMyRoom }',
          }),
        ).resolves.toMatchObject({
          body: {
            kind: 'single',
            singleResult: {
              data: { joinMyRoom: null },
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
      const query = gql`
        query ($roomId: Int!, $userName: String!) {
          joinRoom(roomId: $roomId, userName: $userName)
        }
      `
      describe('No room in DB', () => {
        it('returns null', async () => {
          await expect(
            testServer.executeOperation({
              query,
              variables: {
                userName: 'Pinky Pie',
                roomId: 25,
              },
            }),
          ).resolves.toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: { joinRoom: null },

                errors: undefined,
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
            testServer.executeOperation({
              query,
              variables: {
                userName: 'Pinky Pie',
                roomId,
              },
            }),
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
          await testServer.executeOperation({
            query,
            variables: {
              userName: 'Pinky Pie',
              roomId,
            },
          })
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
      describe.skip('no user in context', () => {
        it('returns null', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: 'mutation($name: String!) { createMyRoom(name: $name) { id } }',
                variables: { name: 'My Room' },
              },
              {
                contextValue: {
                  token: 'token',
                  user: undefined,
                },
              },
            ),
          ).resolves.toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: { createMyRoom: null },
                errors: undefined,
              },
            },
          })
        })
      })

      describe('meeting does not exist', () => {
        it('returns Room', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: 'mutation($name: String!) { createMyRoom(name: $name) { id name } }',
                variables: { name: 'My Room' },
              },
              {
                contextValue: {
                  token: 'token',
                  user: undefined,
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
              name: 'My Room',
            },
          })
        })
      })

      describe('meeting exists', () => {
        it('returns existing Room', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: 'mutation($name: String!) { createMyRoom(name: $name) { id name } }',
                variables: { name: 'New Room' },
              },
              {
                contextValue: {
                  token: 'token',
                  user: undefined,
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
      describe('createMeeting returns undefined', () => {
        it('returns null', async () => {
          createMeetingMock.mockResolvedValue(undefined)
          await expect(
            testServer.executeOperation(
              {
                query: 'query { joinMyRoom }',
              },
              {
                contextValue: {
                  token: 'token',
                },
              },
            ),
          ).resolves.toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: { joinMyRoom: null },
                errors: undefined,
              },
            },
          })
        })
      })

      describe('createMeeting returns meeting', () => {
        it('returns link to the meeting', async () => {
          joinMeetingLinkMock.mockReturnValue('https://my-link')
          createMeetingMock.mockResolvedValue({
            returncode: 'SUCCESS',
            meetingID: 'xxx',
            internalMeetingID: 'b60d121b438a380c343d5ec3c2037564b82ffef3-1715231322715',
            parentMeetingID: 'bbb-none',
            attendeePW: 'w3VUvMcp',
            moderatorPW: 'MyPp9Zfq',
            createTime: 1715231322715,
            voiceBridge: 255,
            dialNumber: '613-555-1234',
            createDate: new Date(),
            hasUserJoined: false,
            duration: 0,
            hasBeenForciblyEnded: false,
            messageKey: '',
            message: '',
          })

          await expect(
            testServer.executeOperation(
              {
                query: 'query { joinMyRoom }',
              },
              {
                contextValue: {
                  token: 'token',
                },
              },
            ),
          ).resolves.toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: { joinMyRoom: 'https://my-link' },
                errors: undefined,
              },
            },
          })
        })
      })
    })
  })
})
