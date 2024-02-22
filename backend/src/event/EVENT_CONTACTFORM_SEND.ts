import { Event } from './Event'
import { EventType } from './EventType'

export const EVENT_CONTACTFORM_SEND = (involvedEmail: string) =>
  Event(EventType.CONTACTFORM_SEND, involvedEmail)
