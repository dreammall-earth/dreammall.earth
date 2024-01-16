import { Resolver, Mutation, Arg } from 'type-graphql'

import { confirmNewsletter, subscribeToNewsletter } from '#api/Brevo'
import { SubscribeToNewsletterInput } from '#inputs/SubscribeToNewsletterInput'

@Resolver()
export class NewsletterSubscriptionResolver {
  @Mutation(() => Boolean)
  async subscribeToNewsletter(
    @Arg('subscribeToNewsletterData') subscribeToNewsletterData: SubscribeToNewsletterInput,
  ): Promise<boolean> {
    return subscribeToNewsletter(
      subscribeToNewsletterData.firstName,
      subscribeToNewsletterData.lastName,
      subscribeToNewsletterData.email,
    )
  }

  @Mutation(() => Boolean)
  async confirmNewsletter(@Arg('code') code: string): Promise<boolean> {
    return confirmNewsletter(code)
  }
}
