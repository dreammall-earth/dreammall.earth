import { Resolver, Mutation, Query, Arg } from 'type-graphql'

import { ContactFormInput } from '#inputs/ContactFormInput'
import { prisma } from '#src/prisma'

@Resolver()
export class ContactFormResolver {
  @Mutation(() => Boolean)
  async createContactForm(
    @Arg('contactFormData') contactFormData: ContactFormInput,
  ): Promise<boolean> {
    await prisma.contactForm.create({ data: contactFormData })
    // code to send email goes here
    return true
  }

  // needed to avoid: GraphQLError: Type Query must define one or more fields
  @Query(() => Boolean)
  contactForm(): boolean {
    return true
  }
}
