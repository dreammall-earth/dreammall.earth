import { Event } from './Event'
import { EventType } from './EventType'

export const EVENT_CREATE_USER = (involvedUserId: number) =>
  Event(EventType.CREATE_USER, { involvedUserId })
