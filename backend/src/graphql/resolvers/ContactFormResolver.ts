import { Resolver, Mutation, Ctx, Arg } from 'type-graphql'

import { ContactFormInput } from '#inputs/ContactFormInput'
import { EVENT_CONTACTFORM_SEND } from '#src/event/Events'

import type { Context } from '#src/context'

@Resolver()
export class ContactFormResolver {
  @Mutation(() => Boolean)
  async createContactForm(
    @Arg('contactFormData') contactFormData: ContactFormInput,
    @Ctx() context: Context,
  ): Promise<boolean> {
    const { brevo } = context
    await brevo.sendContactEmails(contactFormData)
    await EVENT_CONTACTFORM_SEND(contactFormData.email)
    return true
  }
}
