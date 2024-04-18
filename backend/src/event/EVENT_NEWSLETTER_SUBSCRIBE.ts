import { Event } from './Event'
import { EventType } from './EventType'

export const EVENT_NEWSLETTER_SUBSCRIBE = (involvedEmail: string) =>
  Event(EventType.NEWSLETTER_SUBSCRIBE, { involvedEmail })
