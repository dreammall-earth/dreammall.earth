import { NewsletterHeader } from './NewsletterHeader'
import { NewsletterParams } from './NewsletterParams'
import { NewsletterUser } from './NewsletterUser'

export class NewsletterEmailAttributes {
  subject: string
  emailTo: NewsletterUser[]
  htmlContent: string
  sender: NewsletterUser
  cc?: NewsletterUser[]
  bcc?: NewsletterUser[]
  replyTo: NewsletterUser
  headers: NewsletterHeader
  params: NewsletterParams
}
