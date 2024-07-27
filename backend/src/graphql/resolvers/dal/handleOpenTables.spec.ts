import { getMeetings } from '#api/BBB'
import { prisma } from '#src/prisma'

import { handleOpenTables } from './handleOpenTables'

jest.mock('#api/BBB')

const getMeetingsMock = jest.mocked(getMeetings)

describe('handleOpenTables', () => {
  describe('two meetings in db', () => {
    beforeAll(async () => {
      await prisma.meeting.create({
        data: {
          name: 'Meeting 1',
          meetingID: 'Meeting-1',
          createTime: 1234,
        },
      })
      await prisma.meeting.create({
        data: {
          name: 'Meeting 2',
          meetingID: 'Meeting-2',
          createTime: 1234,
        },
      })
    })

    describe('get meetings returns both meetings', () => {
      beforeEach(async () => {
        getMeetingsMock.mockResolvedValue([
          {
            meetingName: 'Meeting 1',
            meetingID: 'Meeting-1',
            internalMeetingID: '258ea7269760758304b6b8494f17e9bf69dc1efe-1718189921310',
            createTime: 1234,
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
          {
            meetingName: 'Meeting 2',
            meetingID: 'Meeting-2',
            internalMeetingID: '258ea7269760758304b6b8494f17e9bf69dc1efe-1718189921310',
            createTime: 1234,
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

        await handleOpenTables()
      })

      it('does not alter the DB', async () => {
        const meetings = await prisma.meeting.findMany()
        expect(meetings).toHaveLength(2)
        expect(meetings).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: 'Meeting 1',
              meetingID: 'Meeting-1',
            }),
            expect.objectContaining({
              name: 'Meeting 2',
              meetingID: 'Meeting-2',
            }),
          ]),
        )
      })
    })

    describe('get meetings returns one meeting', () => {
      beforeEach(async () => {
        getMeetingsMock.mockResolvedValue([
          {
            meetingName: 'Meeting 1',
            meetingID: 'Meeting-1',
            internalMeetingID: '258ea7269760758304b6b8494f17e9bf69dc1efe-1718189921310',
            createTime: 1234,
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

        await handleOpenTables()
      })

      it('resets the missing meeting in DB', async () => {
        const meetings = await prisma.meeting.findMany()
        expect(meetings).toHaveLength(2)
        expect(meetings).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: 'Meeting 1',
              meetingID: 'Meeting-1',
              createTime: 1234n,
            }),
            expect.objectContaining({
              name: 'Meeting 2',
              meetingID: 'Meeting-2',
              createTime: null,
            }),
          ]),
        )
      })
    })

    describe('get meetings returns empty array', () => {
      beforeEach(async () => {
        getMeetingsMock.mockResolvedValue([])

        await handleOpenTables()
      })

      it('resets the meetings in DB', async () => {
        const meetings = await prisma.meeting.findMany()
        expect(meetings).toHaveLength(2)
        expect(meetings).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: 'Meeting 1',
              meetingID: 'Meeting-1',
              createTime: null,
            }),
            expect.objectContaining({
              name: 'Meeting 2',
              meetingID: 'Meeting-2',
              createTime: null,
            }),
          ]),
        )
      })
    })
  })
})
