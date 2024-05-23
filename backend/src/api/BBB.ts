import { createHash } from 'crypto'
import querystring, { ParsedUrlQueryInput } from 'node:querystring'

import axios, { InternalAxiosRequestConfig } from 'axios'
import { XMLParser } from 'fast-xml-parser'

import { CONFIG } from '#config/config'

const parser = new XMLParser()

const axiosInstance = axios.create({
  baseURL: CONFIG.BBB_URL,
  timeout: 25000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})

export const addChecksumParam = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  if (!config.params) {
    config.params = {
      checksum: createChecksum(config.url || CONFIG.BBB_URL),
    }
  } else {
    const checksumParams = querystring
      .stringify(config.params as ParsedUrlQueryInput | undefined)
      .replace(/%20/g, '+')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    config.params = {
      ...config.params,
      checksum: createChecksum(config.url || CONFIG.BBB_URL, checksumParams),
    }
  }
  return config
}

axiosInstance.interceptors.request.use(addChecksumParam, null, { synchronous: true })

export const createChecksum = (callName: string, params: string = ''): string => {
  const hash = createHash('sha1')
  hash.update(
    (callName[0] === '/' ? callName.substring(1) : callName) + params + CONFIG.BBB_SHARED_SECRET,
  )
  return hash.digest('hex')
}

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

interface MeetingInfo {
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
  attendees: string
  metadata: string
  isBreakout: string
}

interface GetMeetingsResponse {
  returncode: string
  meetings: string | { meeting: MeetingInfo[] }
}

export const getMeetings = async () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data } = await axiosInstance.get('/getMeetings')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const parsed: {
      response: GetMeetingsResponse
    } = parser.parse(data as string)
    return parsed.response
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err)
  }
}

interface CreateMeetingOptions {
  name: string
  meetingID: string
  // welcome?: string
}

export const createMeeting = async (options: CreateMeetingOptions) => {
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
    // eslint-disable-next-line no-console
    console.log(err)
  }
}

interface JoinMeetinLinkOptions {
  fullName: string
  meetingID: string
  // role: 'MODERATOR' | 'VIEWER'
  password: string
  // createTime: string
  // userID: string
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
