import { Event } from './Event'

export const EVENT_CONTACTFORM_SEND = (involvedEmail: string) =>
  Event('CONTACTFORM_SEND', { involvedEmail })
