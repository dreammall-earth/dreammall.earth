import { Request } from 'express'

import { CONFIG } from '#config/config'
import logger from '#src/logger'

import { axiosInstance } from './axios'

import {
  joinMeetingLink,
  getMeetings,
  MeetingInfo,
  createMeeting,
  webhook,
  registerWebhook,
} from '.'

// eslint-disable-next-line jest/no-untyped-mock-factory
jest.mock('#src/logger', () => {
  return {
    error: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  }
})

// values taken form https://docs.bigbluebutton.org/development/api/#usage
CONFIG.BBB_SHARED_SECRET = '639259d4-9dd8-4b25-bf01-95f9567eaf4b'
CONFIG.BBB_URL = 'https://my.url/'
CONFIG.BBB_WEBHOOK_URL = 'http://localhost:4000/bbb-webhook'

describe('joinMeetingLink', () => {
  it('returns a link to join the meeting', () => {
    expect(
      joinMeetingLink({
        fullName: 'User',
        meetingID: 'My Meeting',
        password: 'password',
        // role: 'MODERATOR',
        // createTime: 'now',
        // userID: '1234',
      }),
    ).toBe(
      'https://my.url/join?fullName=User&meetingID=My+Meeting&password=password&redirect=true&checksum=d7fdddda59b530a5acb56e77d5683c4324ceac4f',
    )
  })
})

describe('getMeetings', () => {
  const axiosInstanceGetSpy = jest.spyOn(axiosInstance, 'get')

  let result: MeetingInfo[]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('with axios error', () => {
    beforeEach(async () => {
      axiosInstanceGetSpy.mockRejectedValue('Ouch!')
      await getMeetings()
    })

    it('logs get meetings error', () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(logger.error).toHaveBeenCalledWith('getMeetings with error', 'Ouch!')
    })
  })

  describe('with parser error', () => {
    beforeEach(async () => {
      axiosInstanceGetSpy.mockResolvedValue({ data: 'No XML!' })
      await getMeetings()
    })

    it('logs get meetings error with type error', () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(logger.error).toHaveBeenCalledWith(
        'getMeetings with error',
        new TypeError(`Cannot read properties of undefined (reading 'returncode')`),
      )
    })
  })

  describe('with no meeting', () => {
    beforeEach(async () => {
      axiosInstanceGetSpy.mockResolvedValue({
        data: `
<response>
  <returncode>SUCCESS</returncode>
  <meetings/>
  <messageKey>noMeetings</messageKey>
  <message>no meetings were found on this server</message>
</response>
`,
      })
      result = await getMeetings()
    })

    it('logs get meetings error with type error', () => {
      expect(result).toEqual([])
    })
  })

  describe('with one meeting', () => {
    beforeEach(async () => {
      axiosInstanceGetSpy.mockResolvedValue({
        data: `
<response>
  <returncode>SUCCESS</returncode>
  <meetings>
    <meeting>
      <meetingName>Dreammall Entwicklung</meetingName>
      <meetingID>Dreammall-Entwicklung</meetingID>
      <internalMeetingID>258ea7269760758304b6b8494f17e9bf69dc1efe-1718196455938</internalMeetingID>
      <createTime>1718196455938</createTime>
      <createDate>Wed Jun 12 12:47:35 UTC 2024</createDate>
      <voiceBridge>29682</voiceBridge>
      <dialNumber>613-555-1234</dialNumber>
      <attendeePW>2HZnUWpn</attendeePW>
      <moderatorPW>sVNzFAOV</moderatorPW>
      <running>true</running>
      <duration>0</duration>
      <hasUserJoined>true</hasUserJoined>
      <recording>false</recording>
      <hasBeenForciblyEnded>false</hasBeenForciblyEnded>
      <startTime>1718196455941</startTime>
      <endTime>0</endTime>
      <participantCount>1</participantCount>
      <listenerCount>1</listenerCount>
      <voiceParticipantCount>0</voiceParticipantCount>
      <videoCount>0</videoCount>
      <maxUsers>0</maxUsers>
      <moderatorCount>1</moderatorCount>
      <attendees>
        <attendee>
          <userID>w_wqbogvg9stgr</userID>
          <fullName>Peter Lustig</fullName>
          <role>MODERATOR</role>
          <isPresenter>true</isPresenter>
          <isListeningOnly>true</isListeningOnly>
          <hasJoinedVoice>false</hasJoinedVoice>
          <hasVideo>false</hasVideo>
          <clientType>HTML5</clientType>
        </attendee>
      </attendees>
      <metadata>
      </metadata>
      <isBreakout>false</isBreakout>
    </meeting>
  </meetings>
</response>
`,
      })
      result = await getMeetings()
    })

    it('returns the meeting', () => {
      expect(result).toEqual([
        {
          attendeePW: '2HZnUWpn',
          attendees: {
            attendee: {
              clientType: 'HTML5',
              fullName: 'Peter Lustig',
              hasJoinedVoice: false,
              hasVideo: false,
              isListeningOnly: true,
              isPresenter: true,
              role: 'MODERATOR',
              userID: 'w_wqbogvg9stgr',
            },
          },
          createDate: 'Wed Jun 12 12:47:35 UTC 2024',
          createTime: 1718196455938,
          dialNumber: '613-555-1234',
          duration: 0,
          endTime: 0,
          hasBeenForciblyEnded: false,
          hasUserJoined: true,
          internalMeetingID: '258ea7269760758304b6b8494f17e9bf69dc1efe-1718196455938',
          isBreakout: false,
          listenerCount: 1,
          maxUsers: 0,
          meetingID: 'Dreammall-Entwicklung',
          meetingName: 'Dreammall Entwicklung',
          metadata: '',
          moderatorCount: 1,
          moderatorPW: 'sVNzFAOV',
          participantCount: 1,
          recording: false,
          running: true,
          startTime: 1718196455941,
          videoCount: 0,
          voiceBridge: 29682,
          voiceParticipantCount: 0,
        },
      ])
    })
  })

  describe('with two meetings', () => {
    beforeEach(async () => {
      axiosInstanceGetSpy.mockResolvedValue({
        data: `
<response>
  <returncode>SUCCESS</returncode>
  <meetings>
    <meeting>
      <meetingName>Dreammall Entwicklung</meetingName>
      <meetingID>Dreammall-Entwicklung</meetingID>
      <internalMeetingID>258ea7269760758304b6b8494f17e9bf69dc1efe-1718196455938</internalMeetingID>
      <createTime>1718196455938</createTime>
      <createDate>Wed Jun 12 12:47:35 UTC 2024</createDate>
      <voiceBridge>29682</voiceBridge>
      <dialNumber>613-555-1234</dialNumber>
      <attendeePW>2HZnUWpn</attendeePW>
      <moderatorPW>sVNzFAOV</moderatorPW>
      <running>true</running>
      <duration>0</duration>
      <hasUserJoined>true</hasUserJoined>
      <recording>false</recording>
      <hasBeenForciblyEnded>false</hasBeenForciblyEnded>
      <startTime>1718196455941</startTime>
      <endTime>0</endTime>
      <participantCount>1</participantCount>
      <listenerCount>1</listenerCount>
      <voiceParticipantCount>0</voiceParticipantCount>
      <videoCount>0</videoCount>
      <maxUsers>0</maxUsers>
      <moderatorCount>1</moderatorCount>
      <attendees>
        <attendee>
          <userID>w_wqbogvg9stgr</userID>
          <fullName>Peter Lustig</fullName>
          <role>MODERATOR</role>
          <isPresenter>true</isPresenter>
          <isListeningOnly>true</isListeningOnly>
          <hasJoinedVoice>false</hasJoinedVoice>
          <hasVideo>false</hasVideo>
          <clientType>HTML5</clientType>
        </attendee>
      </attendees>
      <metadata>
      </metadata>
      <isBreakout>false</isBreakout>
    </meeting>
    <meeting>
      <meetingName>Dreammall Entwicklung</meetingName>
      <meetingID>Dreammall-Entwicklung</meetingID>
      <internalMeetingID>258ea7269760758304b6b8494f17e9bf69dc1efe-1718196455938</internalMeetingID>
      <createTime>1718196455938</createTime>
      <createDate>Wed Jun 12 12:47:35 UTC 2024</createDate>
      <voiceBridge>29682</voiceBridge>
      <dialNumber>613-555-1234</dialNumber>
      <attendeePW>2HZnUWpn</attendeePW>
      <moderatorPW>sVNzFAOV</moderatorPW>
      <running>true</running>
      <duration>0</duration>
      <hasUserJoined>true</hasUserJoined>
      <recording>false</recording>
      <hasBeenForciblyEnded>false</hasBeenForciblyEnded>
      <startTime>1718196455941</startTime>
      <endTime>0</endTime>
      <participantCount>1</participantCount>
      <listenerCount>1</listenerCount>
      <voiceParticipantCount>0</voiceParticipantCount>
      <videoCount>0</videoCount>
      <maxUsers>0</maxUsers>
      <moderatorCount>1</moderatorCount>
      <attendees>
        <attendee>
          <userID>w_wqbogvg9stgr</userID>
          <fullName>Peter Lustig</fullName>
          <role>MODERATOR</role>
          <isPresenter>true</isPresenter>
          <isListeningOnly>true</isListeningOnly>
          <hasJoinedVoice>false</hasJoinedVoice>
          <hasVideo>false</hasVideo>
          <clientType>HTML5</clientType>
        </attendee>
      </attendees>
      <metadata>
      </metadata>
      <isBreakout>false</isBreakout>
    </meeting>
  </meetings>
</response>
`,
      })
      result = await getMeetings()
    })

    it('returns the meeting', () => {
      expect(result).toEqual([
        {
          attendeePW: '2HZnUWpn',
          attendees: {
            attendee: {
              clientType: 'HTML5',
              fullName: 'Peter Lustig',
              hasJoinedVoice: false,
              hasVideo: false,
              isListeningOnly: true,
              isPresenter: true,
              role: 'MODERATOR',
              userID: 'w_wqbogvg9stgr',
            },
          },
          createDate: 'Wed Jun 12 12:47:35 UTC 2024',
          createTime: 1718196455938,
          dialNumber: '613-555-1234',
          duration: 0,
          endTime: 0,
          hasBeenForciblyEnded: false,
          hasUserJoined: true,
          internalMeetingID: '258ea7269760758304b6b8494f17e9bf69dc1efe-1718196455938',
          isBreakout: false,
          listenerCount: 1,
          maxUsers: 0,
          meetingID: 'Dreammall-Entwicklung',
          meetingName: 'Dreammall Entwicklung',
          metadata: '',
          moderatorCount: 1,
          moderatorPW: 'sVNzFAOV',
          participantCount: 1,
          recording: false,
          running: true,
          startTime: 1718196455941,
          videoCount: 0,
          voiceBridge: 29682,
          voiceParticipantCount: 0,
        },
        {
          attendeePW: '2HZnUWpn',
          attendees: {
            attendee: {
              clientType: 'HTML5',
              fullName: 'Peter Lustig',
              hasJoinedVoice: false,
              hasVideo: false,
              isListeningOnly: true,
              isPresenter: true,
              role: 'MODERATOR',
              userID: 'w_wqbogvg9stgr',
            },
          },
          createDate: 'Wed Jun 12 12:47:35 UTC 2024',
          createTime: 1718196455938,
          dialNumber: '613-555-1234',
          duration: 0,
          endTime: 0,
          hasBeenForciblyEnded: false,
          hasUserJoined: true,
          internalMeetingID: '258ea7269760758304b6b8494f17e9bf69dc1efe-1718196455938',
          isBreakout: false,
          listenerCount: 1,
          maxUsers: 0,
          meetingID: 'Dreammall-Entwicklung',
          meetingName: 'Dreammall Entwicklung',
          metadata: '',
          moderatorCount: 1,
          moderatorPW: 'sVNzFAOV',
          participantCount: 1,
          recording: false,
          running: true,
          startTime: 1718196455941,
          videoCount: 0,
          voiceBridge: 29682,
          voiceParticipantCount: 0,
        },
      ])
    })
  })

  describe('with returncode ERROR', () => {
    beforeEach(async () => {
      axiosInstanceGetSpy.mockResolvedValue({
        data: `
<response>
  <returncode>ERROR</returncode>
  <message>Something went wrong</message>
</response>
`,
      })
      await getMeetings()
    })

    it('logs parser error', () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(logger.error).toHaveBeenCalledWith('parse getMeetings with error', {
        response: {
          message: 'Something went wrong',
          returncode: 'ERROR',
        },
      })
    })
  })
})

describe('createMeeting', () => {
  const axiosInstancePostSpy = jest.spyOn(axiosInstance, 'post')

  describe('with success', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      axiosInstancePostSpy.mockResolvedValue({
        data: `
<response>
  <returncode>SUCCESS</returncode>
  <meetingID>Dreammall-Entwicklung</meetingID>
  <internalMeetingID>258ea7269760758304b6b8494f17e9bf69dc1efe-1718289413143</internalMeetingID>
  <parentMeetingID>bbb-none</parentMeetingID>
  <attendeePW>5ixnD4hJ</attendeePW>
  <moderatorPW>cakLrzBr</moderatorPW>
  <createTime>1718289413143</createTime>
  <voiceBridge>09746</voiceBridge>
  <dialNumber>613-555-1234</dialNumber>
  <createDate>Thu Jun 13 14:36:53 UTC 2024</createDate>
  <hasUserJoined>false</hasUserJoined>
  <duration>0</duration>
  <hasBeenForciblyEnded>false</hasBeenForciblyEnded>
  <messageKey></messageKey>
  <message></message>
</response>
`,
      })
    })

    it('returns create meeting response', async () => {
      await expect(
        createMeeting({
          name: 'Peter Lustig',
          meetingID: 'Peters Raum',
        }),
      ).resolves.toEqual({
        returncode: 'SUCCESS',
        meetingID: 'Dreammall-Entwicklung',
        internalMeetingID: '258ea7269760758304b6b8494f17e9bf69dc1efe-1718289413143',
        parentMeetingID: 'bbb-none',
        attendeePW: '5ixnD4hJ',
        moderatorPW: 'cakLrzBr',
        createTime: 1718289413143,
        voiceBridge: 9746,
        dialNumber: '613-555-1234',
        createDate: 'Thu Jun 13 14:36:53 UTC 2024',
        hasUserJoined: false,
        duration: 0,
        hasBeenForciblyEnded: false,
        messageKey: '',
        message: '',
      })
    })
  })

  describe('with error', () => {
    beforeEach(() => {
      axiosInstancePostSpy.mockRejectedValue('Aua!')
    })

    it('logs create meeting error', async () => {
      await createMeeting({
        name: 'Peter Lustig',
        meetingID: 'Peters Raum',
      })
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(logger.error).toHaveBeenCalledWith('createMeeting with error', 'Aua!')
    })
  })
})

describe('webhook.isAuthorized', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('with checksum error', () => {
    const req = {
      headers: { rawBody: 'MismatchingBody' },
      query: { checksum: 'ef21dc772f12e380e71e929756e05f2a320aa84a' },
      body: { event: '{}', timestamp: 1724836968 },
    } as unknown as Request

    it('returns false', () => {
      expect(webhook.isAuthorized(req)).toBe(false)
    })

    it('logs checksum error', () => {
      webhook.isAuthorized(req)
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(logger.error).toHaveBeenCalledWith(
        'Webhook checksum received (ef21dc772f12e380e71e929756e05f2a320aa84a) does not match calculated checksum 6f355e209efcad2aad189a9fca32cb2dcfd6ac40',
      )
    })
  })

  describe('with header error', () => {
    const req = {
      headers: {
        rawBody: 'Body',
        authorization: 'Bearer InvalidSecret',
      },
      query: {},
      body: { event: '{}', timestamp: 1724836968 },
    } as unknown as Request

    it('returns false', () => {
      expect(webhook.isAuthorized(req)).toBe(false)
    })

    it('logs shared secret error', () => {
      webhook.isAuthorized(req)
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(logger.error).toHaveBeenCalledWith(
        'Webhook bearer header received "(Bearer InvalidSecret)" does not match bbb shared secret configured',
      )
    })
  })

  describe('if both checksum and headers are valid', () => {
    const req = {
      headers: {
        rawBody: 'Body',
        authorization: `Bearer ${CONFIG.BBB_SHARED_SECRET}`,
      },
      query: { checksum: 'ef21dc772f12e380e71e929756e05f2a320aa84a' },
      body: { event: '[{"data": {}}]', timestamp: 1724836968 },
    } as unknown as Request
    it('returns true', () => {
      expect(webhook.isAuthorized(req)).toBe(true)
    })

    it('logs nothing', () => {
      webhook.isAuthorized(req)
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(logger.error).not.toHaveBeenCalled()
    })
  })

  describe('with header success', () => {
    it('returns true', () => {
      const req = {
        headers: {
          rawBody: 'Body',
          authorization: `Bearer ${CONFIG.BBB_SHARED_SECRET}`,
        },
        query: {},
        body: { event: '{}', timestamp: 1724836968 },
      } as unknown as Request
      expect(webhook.isAuthorized(req)).toBe(true)
    })
  })
})

describe('webhook.handleWebhook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('with checksum success', () => {
    it('logs webhook debug info', () => {
      const req = {
        headers: { rawBody: 'Body' },
        query: { checksum: 'ef21dc772f12e380e71e929756e05f2a320aa84a' },
        body: { event: '[{"data": {}}]', timestamp: 1724836968 },
      }
      webhook.handleWebhook(req as unknown as Request)

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(logger.debug).toHaveBeenCalledWith(
        'webhook received',
        new Date('2024-08-28T09:22:48.000Z'),
        [{ data: {} }],
      )
    })
  })

  describe('with header success', () => {
    it('logs webhook debug info', () => {
      const req = {
        headers: {
          rawBody: 'Body',
          authorization: `Bearer ${CONFIG.BBB_SHARED_SECRET}`,
        },
        query: {},
        body: { event: '{}', timestamp: 1724836968 },
      }
      webhook.handleWebhook(req as unknown as Request)

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(logger.debug).toHaveBeenCalledWith(
        'webhook received',
        new Date('2024-08-28T09:22:48.000Z'),
        {},
      )
    })
  })

  describe('event meeting-created', () => {
    it('logs webhook meeting-created', () => {
      const event = {
        type: 'event',
        id: 'meeting-created',
        attributes: {
          meeting: {
            'internal-meeting-id': 'b070c2de30140b9f77b7fa2318de762112e592c5-1725451926427',
            'external-meeting-id': 'be587b9d-1846-491c-a59c-4a1bb1ecf5e8',
            name: 'Test',
            'is-breakout': false,
            duration: 0,
            'create-time': 1725451926427,
            'create-date': 'Wed Sep 04 12:12:06 UTC 2024',
            'moderator-pass': '8w0BAHHH',
            'viewer-pass': 'HxsFc4Z9',
            record: false,
            'voice-conf': '51484',
            'dial-number': '613-555-1234',
            'max-users': 0,
            metadata: {},
          },
        },
        event: {
          ts: 1725451926429,
        },
      }
      const req = {
        headers: { rawBody: 'Body' },
        query: { checksum: 'ef21dc772f12e380e71e929756e05f2a320aa84a' },
        body: {
          event: `[{"data": ${JSON.stringify(event)}}]`,
          timestamp: 1724836968,
        },
      }
      webhook.handleWebhook(req as unknown as Request)

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(logger.debug).toHaveBeenCalledWith(
        'webhook received',
        new Date('2024-08-28T09:22:48.000Z'),
        [{ data: event }],
      )

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(logger.debug).toHaveBeenCalledWith('webhook', 'meeting-created')
    })
  })

  describe('event meeting-ended', () => {
    it('logs webhook meeting-ended', () => {
      const event = {
        type: 'event',
        id: 'meeting-ended',
        attributes: {
          meeting: {
            'internal-meeting-id': 'b070c2de30140b9f77b7fa2318de762112e592c5-1725451345612',
            'external-meeting-id': 'be587b9d-1846-491c-a59c-4a1bb1ecf5e8',
          },
        },
        event: {
          ts: 1725451705451,
        },
      }
      const req = {
        headers: { rawBody: 'Body' },
        query: { checksum: 'ef21dc772f12e380e71e929756e05f2a320aa84a' },
        body: {
          event: `[{"data": ${JSON.stringify(event)}}]`,
          timestamp: 1724836968,
        },
      }
      webhook.handleWebhook(req as unknown as Request)

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(logger.debug).toHaveBeenCalledWith(
        'webhook received',
        new Date('2024-08-28T09:22:48.000Z'),
        [{ data: event }],
      )

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(logger.debug).toHaveBeenCalledWith('webhook', 'meeting-ended')
    })
  })

  describe('event user-joined', () => {
    it('logs webhook user-joined', () => {
      const event = {
        type: 'event',
        id: 'user-joined',
        attributes: {
          meeting: {
            'internal-meeting-id': 'b070c2de30140b9f77b7fa2318de762112e592c5-1725451345612',
            'external-meeting-id': 'be587b9d-1846-491c-a59c-4a1bb1ecf5e8',
          },
          user: {
            'internal-user-id': 'w_82pliky3pdaf',
            'external-user-id': 'w_82pliky3pdaf',
            name: 'authentik Default Admin',
            role: 'MODERATOR',
            presenter: false,
          },
        },
        event: {
          ts: 1725451622572,
        },
      }
      const req = {
        headers: { rawBody: 'Body' },
        query: { checksum: 'ef21dc772f12e380e71e929756e05f2a320aa84a' },
        body: {
          event: `[{"data": ${JSON.stringify(event)}}]`,
          timestamp: 1724836968,
        },
      }
      webhook.handleWebhook(req as unknown as Request)

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(logger.debug).toHaveBeenCalledWith(
        'webhook received',
        new Date('2024-08-28T09:22:48.000Z'),
        [{ data: event }],
      )

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(logger.debug).toHaveBeenCalledWith('webhook', 'user-joined')
    })
  })

  describe('event user-left', () => {
    it('logs webhook user-left', () => {
      const event = {
        type: 'event',
        id: 'user-left',
        attributes: {
          meeting: {
            'internal-meeting-id': 'b070c2de30140b9f77b7fa2318de762112e592c5-1725451136950',
            'external-meeting-id': 'be587b9d-1846-491c-a59c-4a1bb1ecf5e8',
          },
          user: {
            'internal-user-id': 'w_t8tu7qjwy5fg',
            'external-user-id': 'w_t8tu7qjwy5fg',
          },
        },
        event: {
          ts: 1725451221971,
        },
      }
      const req = {
        headers: { rawBody: 'Body' },
        query: { checksum: 'ef21dc772f12e380e71e929756e05f2a320aa84a' },
        body: {
          event: `[{"data": ${JSON.stringify(event)}}]`,
          timestamp: 1724836968,
        },
      }
      webhook.handleWebhook(req as unknown as Request)

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(logger.debug).toHaveBeenCalledWith(
        'webhook received',
        new Date('2024-08-28T09:22:48.000Z'),
        [{ data: event }],
      )

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(logger.debug).toHaveBeenCalledWith('webhook', 'user-left')
    })
  })

  describe('unhandled event', () => {
    it('logs unhandled', () => {
      const event = {
        type: 'event',
        id: 'unknown-id',
      }
      const req = {
        body: {
          event: `[{"data": ${JSON.stringify(event)}}]`,
          timestamp: 1724836968,
        },
      }
      webhook.handleWebhook(req as unknown as Request)

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(logger.debug).toHaveBeenCalledWith('webhook unhandled event', {
        type: 'event',
        id: 'unknown-id',
      })
    })
  })
})

describe('registerWebhook', () => {
  const axiosInstanceGetSpy = jest.spyOn(axiosInstance, 'get')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('with success', () => {
    it('returns true and logs success info', async () => {
      axiosInstanceGetSpy.mockResolvedValue({ data: '<returncode>SUCCESS</returncode>' })

      await expect(registerWebhook()).resolves.toBe(true)

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(logger.info).toHaveBeenCalledWith('Webhook registered successfully')
    })
  })

  describe('with error from the api', () => {
    it('returns false and logs api error', async () => {
      axiosInstanceGetSpy.mockResolvedValue({ data: '<returncode>FAILURE</returncode>' })

      await expect(registerWebhook()).resolves.toBe(false)

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(logger.error).toHaveBeenCalledWith(
        'Webhook was not registered due to an error:',
        '<returncode>FAILURE</returncode>',
      )
    })
  })

  describe('with no BBB_WEBHOOK_URL configured', () => {
    it('returns false and logs warning', async () => {
      CONFIG.BBB_WEBHOOK_URL = ''

      await expect(registerWebhook()).resolves.toBe(false)

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(logger.warn).toHaveBeenCalledWith(
        'Webhook was not registered since BBB_WEBHOOK_URL is empty or undefined',
      )
    })
  })
})
