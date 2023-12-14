import { Resolver, Mutation, Arg } from 'type-graphql'

import { prisma } from '#src/prisma'

@Resolver()
export class NewsletterSubscriptionResolver {
  @Mutation(() => Boolean)
  async subscribeToNewsletter(@Arg('email', () => String) email: string): Promise<boolean> {
    await prisma.newsletterSubscription.create({ data: { email } })
    return true
  }
}
