import { Event } from './Event'
import { EventType } from './EventType'

export const EVENT_CREATE_USER = async (involvedUserId: number) =>
  await Event(EventType.CREATE_USER, { involvedUserId })
