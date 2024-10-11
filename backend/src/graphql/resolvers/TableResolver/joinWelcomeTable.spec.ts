import { ApolloServer } from '@apollo/server'

import { createMeeting, joinMeetingLink } from '#api/BBB'
import { findOrCreateUser } from '#src/context/findOrCreateUser'
import { prisma } from '#src/prisma'
import { createTestServer } from '#src/server/server'
import { mockContextValue } from '#test/mockContextValue'

import type { Context } from '#src/context'

jest.mock<typeof import('#api/BBB')>('#api/BBB', () => {
  const api: typeof import('#api/BBB') = jest.requireActual('#api/BBB')
  return {
    ...api,
    createMeeting: jest.fn(),
    joinMeetingLink: jest.fn(),
  }
})

const createMeetingMock = jest.mocked(createMeeting)
const joinMeetingLinkMock = jest.mocked(joinMeetingLink)
const pk = 19
const nickname = 'mockedUser'
const name = 'User'

let testServer: ApolloServer<Context>

const joinWelcomeTableQuery = `
  query {
    joinWelcomeTable
  }
`

describe('TableResolver', () => {
  beforeAll(async () => {
    testServer = await createTestServer()
  })
  beforeEach(jest.clearAllMocks)

  describe('unauthorized', () => {
    describe('joinWelcomeTable', () => {
      it('throws access denied', async () => {
        await expect(
          testServer.executeOperation(
            {
              query: joinWelcomeTableQuery,
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
  })

  describe('authorized', () => {
    describe('joinWelcomeTable', () => {
      let contextValue: ReturnType<typeof mockContextValue>
      beforeEach(async () => {
        const user = await findOrCreateUser({ prisma })({ pk, nickname, name })
        contextValue = mockContextValue({ user })
        contextValue.config.WELCOME_TABLE_MEETING_ID = '4711-42'
        contextValue.config.WELCOME_TABLE_NAME = 'I am the WELCOME_TABLE_ID'
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
        joinMeetingLinkMock.mockReturnValue('https://my-link')
      })

      it('responds with a url that can be embedded in an <iframe>', async () => {
        await expect(
          testServer.executeOperation(
            {
              query: joinWelcomeTableQuery,
            },
            { contextValue },
          ),
        ).resolves.toMatchObject({
          body: {
            kind: 'single',
            singleResult: {
              data: { joinWelcomeTable: 'https://my-link' },
              errors: undefined,
            },
          },
        })
      })

      it('builds a URL from the response of the API call to create a BBB session', async () => {
        await testServer.executeOperation({ query: joinWelcomeTableQuery }, { contextValue })
        expect(joinMeetingLinkMock).toHaveBeenCalledWith({
          fullName: 'User',
          meetingID: '4711-42',
          password: 'MyPp9Zfq',
        })
      })
    })
  })
})
