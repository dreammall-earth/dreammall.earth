import { ContactForm } from '@prisma/client'
import { Resolver, Mutation, Query, Arg } from 'type-graphql'

import { sendContactFormEmail } from '#api/NewsletterBrevo'
import { ContactFormInput } from '#inputs/ContactFormInput'
import { prisma } from '#src/prisma'

@Resolver()
export class ContactFormResolver {
  @Mutation(() => Boolean)
  async createContactForm(
    @Arg('contactFormData') contactFormData: ContactFormInput,
  ): Promise<boolean> {
    const contactForm: ContactForm = await prisma.contactForm.create({ data: contactFormData })
    // code to send email goes here
    void sendContactFormEmail(contactForm)
    return true
  }

  // needed to avoid: GraphQLError: Type Query must define one or more fields
  @Query(() => Boolean)
  contactForm(): boolean {
    return true
  }
}
