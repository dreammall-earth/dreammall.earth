import { Resolver, Mutation, Query, Arg } from 'type-graphql'

import { sendContactEmails } from '#api/Brevo'
import { ContactFormInput } from '#inputs/ContactFormInput'
import { EVENT_CONTACTFORM_SEND } from '#src/event/Events'

@Resolver()
export class ContactFormResolver {
  @Mutation(() => Boolean)
  createContactForm(@Arg('contactFormData') contactFormData: ContactFormInput): boolean {
    void sendContactEmails(contactFormData)
    void EVENT_CONTACTFORM_SEND(contactFormData.email)
    return true
  }

  // TODO: remove - see https://github.com/MichalLytek/type-graphql/issues/301#issuecomment-480046611
  // needed to avoid: GraphQLError: Type Query must define one or more fields
  @Query(() => Boolean)
  contactForm(): boolean {
    return true
  }
}
