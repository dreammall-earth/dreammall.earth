import { GraphQLSchema } from 'graphql'
import { buildSchema } from 'type-graphql'

import { authChecker } from '#src/auth/authChecker'

import { pubSub } from './pubSub'
import { ContactFormResolver } from './resolvers/ContactFormResolver'
import { NewsletterSubscriptionResolver } from './resolvers/NewsletterSubscriptionResolver'
import { RoomResolver } from './resolvers/RoomResolver'

export const schema = async (): Promise<GraphQLSchema> => {
  return buildSchema({
    resolvers: [ContactFormResolver, NewsletterSubscriptionResolver, RoomResolver],
    pubSub,
    validate: {
      validationError: { target: false },
      skipMissingProperties: true,
      skipNullProperties: true,
      skipUndefinedProperties: false,
      forbidUnknownValues: true,
      stopAtFirstError: true,
    },
    authChecker,
  })
}
