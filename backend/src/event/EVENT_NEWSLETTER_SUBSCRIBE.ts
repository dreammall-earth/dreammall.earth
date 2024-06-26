import { Event } from './Event'
import { EventType } from './EventType'

export const EVENT_NEWSLETTER_SUBSCRIBE = async (involvedEmail: string) =>
  await Event(EventType.NEWSLETTER_SUBSCRIBE, { involvedEmail })
