import { CONFIG } from '#config/config'
import logger from '#src/logger'

import { joinMeetingLink, getMeetings, MeetingInfo, createMeeting } from './BBB'
import { axiosInstance } from './BBB/axios'

// eslint-disable-next-line jest/no-untyped-mock-factory
jest.mock('#src/logger', () => {
  return {
    error: jest.fn(),
  }
})

// values taken form https://docs.bigbluebutton.org/development/api/#usage
CONFIG.BBB_SHARED_SECRET = '639259d4-9dd8-4b25-bf01-95f9567eaf4b'
CONFIG.BBB_URL = 'https://my.url/'

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
