import { Event } from './Event'
import { EventType } from './EventType'

export const EVENT_UPDATE_TABLE = (involvedUserId: number) =>
  Event(EventType.UPDATE_TABLE, { involvedUserId })
