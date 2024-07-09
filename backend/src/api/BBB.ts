import { XMLParser } from 'fast-xml-parser'

import { CONFIG } from '#config/config'
import logger from '#src/logger'

import { axiosInstance, createChecksum } from './BBB/axios'
import {
  CreateMeetingResponse,
  MeetingInfo,
  GetMeetingsResponse,
  CreateMeetingOptions,
  JoinMeetinLinkOptions,
} from './BBB/types'

export { MeetingInfo, AttendeeInfo } from './BBB/types'

const parser = new XMLParser()

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
