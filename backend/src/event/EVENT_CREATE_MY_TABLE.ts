import { Event } from './Event'

export const EVENT_CREATE_MY_TABLE = (involvedUserId: number) =>
  Event('CREATE_MY_TABLE', { involvedUserId })
