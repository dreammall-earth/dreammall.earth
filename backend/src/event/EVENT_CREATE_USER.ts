import { Event } from './Event'

export const EVENT_CREATE_USER = (involvedUserId: number) =>
  Event('CREATE_USER', { involvedUserId })
