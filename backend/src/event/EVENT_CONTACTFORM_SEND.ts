import { Event } from './Event'
import { EventType } from './EventType'

export const EVENT_CONTACTFORM_SEND = async (involvedEmail: string) =>
  await Event(EventType.CONTACTFORM_SEND, { involvedEmail })
