import { Event } from './Event'

export const EVENT_NEWSLETTER_SUBSCRIBE = (involvedEmail: string) =>
  Event('NEWSLETTER_SUBSCRIBE', { involvedEmail })
