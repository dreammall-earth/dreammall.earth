import { Event } from './Event'
import { EventType } from './EventType'

export const EVENT_NEWSLETTER_CONFIRM = async (involvedEmail?: string) =>
  await Event(EventType.NEWSLETTER_CONFIRM, { involvedEmail })
