import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

import { schema } from '#graphql/schema'

import { Context } from './context'
// import logger from './logger'

export const createServer = async (): Promise<ApolloServer> => {
  return new ApolloServer({
    schema: await schema(),
    // plugins: [logger],
  })
}

export async function listen(port: number) {
  const { url } = await startStandaloneServer(await createServer(), {
    listen: { port },
    context: async ({ req }): Promise<Context> => ({
      token: req.headers.authorization
        ? req.headers.authorization.replace(/^[Bb]earer */, '')
        : undefined,
    }),
  })

  return url
}
