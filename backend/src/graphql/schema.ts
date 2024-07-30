import { GraphQLSchema } from 'graphql'
import { buildSchema } from 'type-graphql'

import { CONFIG } from '#config/config'
import { authChecker } from '#src/auth/authChecker'

import { pubSub } from './pubSub'
import { ContactFormResolver } from './resolvers/ContactFormResolver'
import { checkForOpenRooms } from './resolvers/dal/handleOpenRooms'
import { NewsletterSubscriptionResolver } from './resolvers/NewsletterSubscriptionResolver'
import { RoomResolver } from './resolvers/RoomResolver'
import { UserResolver } from './resolvers/UserResolver'

if (CONFIG.BBB_PULL_MEETINGS) void checkForOpenRooms()

export const schema = async (): Promise<GraphQLSchema> => {
  return buildSchema({
    resolvers: [ContactFormResolver, NewsletterSubscriptionResolver, RoomResolver, UserResolver],
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
