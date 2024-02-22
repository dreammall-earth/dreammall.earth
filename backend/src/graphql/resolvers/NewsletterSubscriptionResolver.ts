import { Resolver, Mutation, Arg } from 'type-graphql'

import { confirmNewsletter, subscribeToNewsletter } from '#api/Brevo'
import { SubscribeToNewsletterInput } from '#inputs/SubscribeToNewsletterInput'
import { EVENT_NEWSLETTER_CONFIRM, EVENT_NEWSLETTER_SUBSCRIBE } from '#src/event/Events'

@Resolver()
export class NewsletterSubscriptionResolver {
  @Mutation(() => Boolean)
  async subscribeToNewsletter(
    @Arg('subscribeToNewsletterData') subscribeToNewsletterData: SubscribeToNewsletterInput,
  ): Promise<boolean> {
    const result = subscribeToNewsletter(
      subscribeToNewsletterData.firstName,
      subscribeToNewsletterData.lastName,
      subscribeToNewsletterData.email,
    )
    void EVENT_NEWSLETTER_SUBSCRIBE(subscribeToNewsletterData.email)
    return result
  }

  @Mutation(() => Boolean)
  async confirmNewsletter(@Arg('code') code: string): Promise<boolean> {
    const result = await confirmNewsletter(code)
    void EVENT_NEWSLETTER_CONFIRM(result ? result.email : undefined)
    return !!result
  }
}
