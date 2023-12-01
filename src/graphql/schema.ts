import path from 'path'
import { fileURLToPath } from 'url'

import { GraphQLSchema } from 'graphql'
import { buildSchema } from 'type-graphql'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const schema = async (): Promise<GraphQLSchema> => {
  return buildSchema({
    resolvers: [path.join(__dirname, 'resolvers', `!(*.spec).{ts,js}`)],
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
