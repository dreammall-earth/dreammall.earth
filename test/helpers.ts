import { ApolloServer } from 'apollo-server-express'
import { createTestClient } from 'apollo-server-testing'

import { schema } from '#graphql/schema'

export const testEnvironment = async () => {
  const server = new ApolloServer({
    schema: await schema(),
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createTestClient(server as any)
}
