import { Event } from './Event'

export const EVENT_UPDATE_MY_TABLE = (involvedUserId: number) =>
  Event('UPDATE_MY_TABLE', { involvedUserId })
