import { Event } from './Event'
import { EventType } from './EventType'

export const EVENT_NEWSLETTER_CONFIRM = (involvedEmail?: string) =>
  Event(EventType.NEWSLETTER_CONFIRM, { involvedEmail })
