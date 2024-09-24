import { Event } from './Event'

export const EVENT_CREATE_TABLE = (involvedUserId: number) =>
  Event('CREATE_TABLE', { involvedUserId })
