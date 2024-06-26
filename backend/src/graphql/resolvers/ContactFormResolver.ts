import { Resolver, Mutation, Arg } from 'type-graphql'

import { sendContactEmails } from '#api/Brevo'
import { ContactFormInput } from '#inputs/ContactFormInput'
import { EVENT_CONTACTFORM_SEND } from '#src/event/Events'

@Resolver()
export class ContactFormResolver {
  @Mutation(() => Boolean)
  async createContactForm(
    @Arg('contactFormData') contactFormData: ContactFormInput,
  ): Promise<boolean> {
    void sendContactEmails(contactFormData)
    await EVENT_CONTACTFORM_SEND(contactFormData.email)
    return true
  }
}
