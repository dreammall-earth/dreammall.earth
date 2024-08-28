import { Request } from 'express'
import { XMLParser } from 'fast-xml-parser'

import { CONFIG } from '#config/config'
import logger from '#src/logger'

import { axiosInstance, createChecksum } from './BBB/axios'
import {
  AttendeeRole, // eslint-disable-line @typescript-eslint/no-unused-vars
  CreateMeetingResponse,
  MeetingInfo,
  GetMeetingsResponse,
  CreateMeetingOptions,
  JoinMeetinLinkOptions,
  CreateMeetingBodyOptions,
  MeetingLayouts,
} from './BBB/types'

export { MeetingInfo, AttendeeInfo, AttendeeRole } from './BBB/types'

const alwaysArray = ['response.meetings.meeting']

const parser = new XMLParser({
  isArray: (_, jpath) => alwaysArray.indexOf(jpath) !== -1,
})

const defaultCreateMeetingBodyOptions = {
  welcome: '<div></div>',
  meetingLayout: MeetingLayouts.SMART_LAYOUT,
  logoutURL: new URL('table-closed/', CONFIG.FRONTEND_URL),
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
      return parsed.response.meetings.meeting
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
  bodyOptions: CreateMeetingBodyOptions = {},
): Promise<CreateMeetingResponse | null> => {
  const { name, meetingID } = options
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data } = await axiosInstance.post(
      '/create',
      {
        ...defaultCreateMeetingBodyOptions,
        ...bodyOptions,
      },
      {
        params: {
          name,
          meetingID,
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

export const handleWebhook = (req: Request): void => {
  // Checksum validation
  const checksum = createChecksum(CONFIG.BBB_WEBHOOK_URL, req.headers.rawBody as string)
  if (req.query.checksum !== checksum) {
    logger.error(
      `Webhook checksum received (${req.query.checksum as string}) does not match calculated checksum ${checksum}`,
    )
    return
  }

  // Webhook Handling
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const event = JSON.parse(req.body.event as string)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const timestamp = new Date((req.body.timestamp as number) * 1000)
  logger.debug('webhook received', timestamp, event)
}

export const registerWebhook = async (): Promise<boolean> => {
  if (CONFIG.BBB_WEBHOOK_URL === '') {
    logger.warn('Webhook was not registered since BBB_WEBHOOK_URL is empty or undefined')
    return false
  }

  const params = {
    callbackURL: CONFIG.BBB_WEBHOOK_URL,
  }

  const result = await axiosInstance.get<string>('hooks/create', { params })
  if (result.data.indexOf('<returncode>SUCCESS</returncode>') === -1) {
    logger.error('Webhook was not registered due to an error:', result.data)
    return false
  }
  logger.info('Webhook registered successfully')
  return true
}

export const periodicallyRegisterWebhook = (): void => {
  void registerWebhook()
  setTimeout(periodicallyRegisterWebhook, 100 * 1000)
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
