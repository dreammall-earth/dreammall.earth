import { Event } from './Event'

export const EVENT_UPDATE_TABLE = (involvedUserId: number) =>
  Event('UPDATE_TABLE', { involvedUserId })
