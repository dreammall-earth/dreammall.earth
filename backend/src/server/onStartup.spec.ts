import { deleteAll } from '#test/helpers'
import { mockContextValue } from '#test/mockContextValue'

import { onStartup } from './onStartup'

describe('onStartup', () => {
  beforeEach(deleteAll)

  const WELCOME_TABLE_MEETING_ID = 'this-is-the-welcome-table-meeting-id'

  it('ensures there is a "Welcome" table in the database', async () => {
    const {
      config,
      dataSources: { prisma },
    } = mockContextValue()
    const CONFIG = { ...config, WELCOME_TABLE_MEETING_ID }
    await expect(prisma.meeting.findMany()).resolves.toEqual([])
    await onStartup({ config: CONFIG, prisma })
    await expect(prisma.meeting.findMany()).resolves.toEqual([
      {
        attendeePW: null,
        createDate: null,
        createTime: null,
        createdAt: expect.any(Date), // eslint-disable-line @typescript-eslint/no-unsafe-assignment
        dialNumber: null,
        id: expect.any(Number), // eslint-disable-line @typescript-eslint/no-unsafe-assignment
        meetingID: 'this-is-the-welcome-table-meeting-id',
        moderatorPW: null,
        name: '',
        public: true,
        type: 'PERMANENT',
        voiceBridge: null,
      },
    ])
  })

  describe('given there is already an existing welcome table', () => {
    it('ensures that the `table.id` stays the same as before', async () => {
      const {
        config,
        dataSources: { prisma },
      } = mockContextValue()

      await prisma.meeting.create({
        data: {
          id: 4711,
          name: '',
          type: 'PERMANENT',
          meetingID: WELCOME_TABLE_MEETING_ID,
        },
      })

      const CONFIG = { ...config, WELCOME_TABLE_MEETING_ID }
      await onStartup({ config: CONFIG, prisma })
      await expect(prisma.meeting.findMany()).resolves.toEqual([
        {
          attendeePW: null,
          createDate: null,
          createTime: null,
          createdAt: expect.any(Date), // eslint-disable-line @typescript-eslint/no-unsafe-assignment
          dialNumber: null,
          id: 4711,
          meetingID: 'this-is-the-welcome-table-meeting-id',
          moderatorPW: null,
          name: '',
          public: true,
          type: 'PERMANENT',
          voiceBridge: null,
        },
      ])
    })

    describe('if the `WELCOME_TABLE_MEETING_NAME` changes', () => {
      it('updates that the `table.name`', async () => {
        const {
          config,
          dataSources: { prisma },
        } = mockContextValue()

        await prisma.meeting.create({
          data: {
            id: 4711,
            name: 'This is my previous name',
            type: 'PERMANENT',
            meetingID: WELCOME_TABLE_MEETING_ID,
          },
        })

        const CONFIG = {
          ...config,
          WELCOME_TABLE_MEETING_ID,
          WELCOME_TABLE_NAME: 'I have a new name',
        }
        await onStartup({ config: CONFIG, prisma })
        await expect(prisma.meeting.findMany()).resolves.toEqual([
          {
            attendeePW: null,
            createDate: null,
            createTime: null,
            createdAt: expect.any(Date), // eslint-disable-line @typescript-eslint/no-unsafe-assignment
            dialNumber: null,
            id: 4711,
            meetingID: 'this-is-the-welcome-table-meeting-id',
            moderatorPW: null,
            name: 'I have a new name',
            public: true,
            type: 'PERMANENT',
            voiceBridge: null,
          },
        ])
      })
    })

    describe('but if the `WELCOME_TABLE_MEETING_ID` is not pinned on a specific value or gets changed', () => {
      it("may lead to state in the database that won't get cleaned up", async () => {
        const {
          config,
          dataSources: { prisma },
        } = mockContextValue()

        await prisma.meeting.create({
          data: {
            id: 4711,
            name: '',
            type: 'PERMANENT',
            meetingID: WELCOME_TABLE_MEETING_ID,
          },
        })

        const CONFIG = {
          ...config,
          WELCOME_TABLE_MEETING_ID: 'a8b3a832-1254-4fc5-9008-4959cffe8c94',
        }
        await onStartup({ config: CONFIG, prisma })
        await expect(prisma.meeting.findMany()).resolves.toEqual([
          {
            attendeePW: null,
            createDate: null,
            createTime: null,
            createdAt: expect.any(Date), // eslint-disable-line @typescript-eslint/no-unsafe-assignment
            dialNumber: null,
            id: 4711,
            meetingID: 'this-is-the-welcome-table-meeting-id',
            moderatorPW: null,
            name: '',
            public: true,
            type: 'PERMANENT',
            voiceBridge: null,
          },
          {
            attendeePW: null,
            createDate: null,
            createTime: null,
            createdAt: expect.any(Date), // eslint-disable-line @typescript-eslint/no-unsafe-assignment
            dialNumber: null,
            id: expect.any(Number), // eslint-disable-line @typescript-eslint/no-unsafe-assignment
            meetingID: 'a8b3a832-1254-4fc5-9008-4959cffe8c94',
            moderatorPW: null,
            name: '',
            public: true,
            type: 'PERMANENT',
            voiceBridge: null,
          },
        ])
      })
    })
  })
})
