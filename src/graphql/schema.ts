import path from 'path'

import { GraphQLSchema } from 'graphql'
import { buildSchema } from 'type-graphql'

export const schema = async (): Promise<GraphQLSchema> => {
  return buildSchema({
    resolvers: [path.join(__dirname, 'resolvers', `!(*.spec).{ts}`)],
    validate: {
      validationError: { target: false },
      skipMissingProperties: true,
      skipNullProperties: true,
      skipUndefinedProperties: false,
      forbidUnknownValues: true,
      stopAtFirstError: true,
    },
  })
}
