import { Event } from './Event'
import { EventType } from './EventType'

export const EVENT_CREATE_MY_TABLE = (involvedUserId: number) =>
  Event(EventType.CREATE_MY_TABLE, { involvedUserId })
