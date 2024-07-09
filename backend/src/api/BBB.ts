import { XMLParser } from 'fast-xml-parser'

import { CONFIG } from '#config/config'
import logger from '#src/logger'

import { axiosInstance, createChecksum } from './BBB/axios'

const parser = new XMLParser()

interface CreateMeetingResponse {
  returncode: string
  meetingID: string
  internalMeetingID: string
  parentMeetingID: string
  attendeePW: string
  moderatorPW: string
  createTime: number
  voiceBridge: number
  dialNumber: string
  createDate: Date
  hasUserJoined: boolean
  duration: number
  hasBeenForciblyEnded: boolean
  messageKey: string
  message: string
}

export type AttendeeInfo = {
  userID: string
  fullName: string
  role: string
  isPresenter: boolean
  isListeningOnly: boolean
  hasJoinedVoice: boolean
  hasVideo: boolean
  clientType: string
}

export type MeetingInfo = {
  meetingName: string
  meetingID: string
  internalMeetingID: string
  createTime: number
  createDate: Date
  voiceBridge: number
  dialNumber: string
  attendeePW: string
  moderatorPW: string
  running: boolean
  duration: number
  hasUserJoined: boolean
  recording: boolean
  hasBeenForciblyEnded: boolean
  startTime: number
  endTime: number
  participantCount: number
  listenerCount: number
  voiceParticipantCount: number
  videoCount: number
  maxUsers: number
  moderatorCount: number
  attendees: string | { attendee: AttendeeInfo[] | AttendeeInfo }
  metadata: string
  isBreakout: boolean
}

type GetMeetingsResponse = {
  returncode: string
  meetings: { meeting: MeetingInfo[] } | string
}

export const getMeetings = async (): Promise<MeetingInfo[]> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data } = await axiosInstance.get('/getMeetings')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const parsed: {
      response: GetMeetingsResponse
    } = parser.parse(data as string)
    if (parsed.response.returncode === 'SUCCESS') {
      if (typeof parsed.response.meetings === 'string') return []
      if (Array.isArray(parsed.response.meetings?.meeting)) {
        return parsed.response.meetings.meeting
      } else {
        return [parsed.response.meetings.meeting]
      }
    } else {
      logger.error('parse getMeetings with error', parsed)
    }
  } catch (err) {
    logger.error('getMeetings with error', err)
  }
  return []
}

interface CreateMeetingOptions {
  name: string
  meetingID: string
  // welcome?: string
}

export const createMeeting = async (
  options: CreateMeetingOptions,
): Promise<CreateMeetingResponse | null> => {
  const { name, meetingID /*, welcome */ } = options
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data } = await axiosInstance.post(
      '/create',
      {},
      {
        params: {
          name,
          meetingID,
          // welcome,
        },
      },
    )
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const parsed: {
      response: CreateMeetingResponse
    } = parser.parse(data as string)
    return parsed.response
  } catch (err) {
    logger.error('createMeeting with error', err)
    return null
  }
}

interface JoinMeetinLinkOptions {
  fullName: string
  meetingID: string
  role?: 'MODERATOR' | 'VIEWER'
  password?: string
  createTime?: string
  userID?: string
}

export const joinMeetingLink = (options: JoinMeetinLinkOptions): string => {
  const params = new URLSearchParams({
    ...options,
    redirect: 'true',
  }).toString()
  const checksum = createChecksum('join', params)
  return CONFIG.BBB_URL + 'join?' + params + '&checksum=' + checksum
}

/*
export const listHooks = async () => {
  try {
    const result = await axiosInstance.get('/hooks/list')
    console.log(result)
  } catch (err) {
    console.log(err)
  }
}


*/
