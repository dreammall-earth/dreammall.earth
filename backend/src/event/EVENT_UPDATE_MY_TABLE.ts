import { Event } from './Event'
import { EventType } from './EventType'

export const EVENT_UPDATE_MY_TABLE = (involvedUserId: number) =>
  Event(EventType.UPDATE_MY_TABLE, { involvedUserId })
