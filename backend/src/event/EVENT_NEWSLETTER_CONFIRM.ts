import { Event } from './Event'

export const EVENT_NEWSLETTER_CONFIRM = (involvedEmail?: string) =>
  Event('NEWSLETTER_CONFIRM', { involvedEmail })
