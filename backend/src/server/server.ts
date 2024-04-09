import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

import { schema } from '#graphql/schema'

import { Context, getContextToken, GetConextToken } from './context'
// import logger from './logger'

export const createServer = async (): Promise<ApolloServer> => {
  return new ApolloServer<Context>({
    schema: await schema(),
    // plugins: [logger],
  })
}

export async function listen(port: number, getToken: GetConextToken = getContextToken) {
  const { url } = await startStandaloneServer(await createServer(), {
    listen: { port },
    // eslint-disable-next-line @typescript-eslint/require-await
    context: async ({ req }): Promise<Context> => ({
      token: getToken(req.headers.authorization),
    }),
  })

  return url
}
