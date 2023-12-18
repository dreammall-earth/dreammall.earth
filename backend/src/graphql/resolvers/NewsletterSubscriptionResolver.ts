import { Resolver, Mutation, Arg } from 'type-graphql'

import { SubscribeToNewsletterInput } from '#inputs/SubscribeToNewsletterInput'
import { prisma } from '#src/prisma'

@Resolver()
export class NewsletterSubscriptionResolver {
  @Mutation(() => Boolean)
  async subscribeToNewsletter(
    @Arg('subscribeToNewsletterData') subscribeToNewsletterData: SubscribeToNewsletterInput,
  ): Promise<boolean> {
    await prisma.newsletterSubscription.create({ data: subscribeToNewsletterData })
    return true
  }
}
