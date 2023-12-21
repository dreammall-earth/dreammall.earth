import { Resolver, Mutation, Arg } from 'type-graphql'

import { subscribeToNewsletter } from '#api/Brevo'
import { SubscribeToNewsletterInput } from '#inputs/SubscribeToNewsletterInput'
import { prisma } from '#src/prisma'

@Resolver()
export class NewsletterSubscriptionResolver {
  @Mutation(() => Boolean)
  async subscribeToNewsletter(
    @Arg('subscribeToNewsletterData') subscribeToNewsletterData: SubscribeToNewsletterInput,
  ): Promise<boolean> {
    const subscriber = await prisma.newsletterSubscription.create({
      data: subscribeToNewsletterData,
    })
    void subscribeToNewsletter(subscriber)
    return true
  }
}
