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
  // Authorization
  if (req.query.checksum) {
    // Checksum validation
    const checksum = createChecksum(CONFIG.BBB_WEBHOOK_URL, req.headers.rawBody as string)
    if (req.query.checksum !== checksum) {
      logger.error(
        `Webhook checksum received (${req.query.checksum as string}) does not match calculated checksum ${checksum}`,
      )
      return
    }
  } else {
    // Bearer Header validation
    // In case auth2.0 is configured in bbb no checksum is transmitted but the shared secret is in the header.
    // This case is not documented in the webhook documentation, but there is an issue for this case: https://github.com/bigbluebutton/bbb-webhooks/issues/8
    if (req.headers.authorization !== `Bearer ${CONFIG.BBB_SHARED_SECRET}`) {
      logger.error(
        `Webhook bearer header received "(${req.headers.authorization as string})" does not match bbb shared secret configured`,
      )
      return
    }
  }

  // Webhook Handling
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const webhook = JSON.parse(req.body.event as string)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const timestamp = new Date((req.body.timestamp as number) * 1000)
  logger.debug('webhook received', timestamp, webhook)

  // eslint-disable-next-line dot-notation, @typescript-eslint/no-unsafe-member-access
  if (!Array.isArray(webhook) || !webhook[0]['data']) {
    logger.debug('webhook cannot be parsed')
    return
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const event = webhook[0].data

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (event.type === 'event' && event.id) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    switch (event.id) {
      case 'meeting-created':
        /*
        {
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
        */
        logger.debug('webhook', 'meeting-created')
        break
      case 'meeting-ended':
        /* This does not trigger user left!
        {
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
        */
        logger.debug('webhook', 'meeting-ended')
        break
      case 'user-joined':
        /*
        {
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
        */
        logger.debug('webhook', 'user-joined')
        break
      case 'user-left':
        /*
        {
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
       */
        logger.debug('webhook', 'user-left')
        break
      default:
        logger.debug('webhook', 'unhandled')
    }
  }
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
