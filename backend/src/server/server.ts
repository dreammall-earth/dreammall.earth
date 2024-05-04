import { ApolloServer, ApolloServerPlugin } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

import { schema } from '#graphql/schema'

import { Context, getContextToken, GetContextToken } from './context'
import logger from './logger'

export const createServer = async (withLogger: boolean = true): Promise<ApolloServer> => {
  const plugins: ApolloServerPlugin<Context>[] = []
  if (withLogger) plugins.push(logger)
  return new ApolloServer<Context>({
    schema: await schema(),
    plugins,
  })
}

export const createTestServer = async () => {
  return await createServer(false)
}

export async function listen(port: number, getToken: GetContextToken = getContextToken) {
  const { url } = await startStandaloneServer(await createServer(), {
    listen: { port },
    // eslint-disable-next-line @typescript-eslint/require-await
    context: async ({ req }): Promise<Context> => ({
      token: getToken(req.headers.authorization),
    }),
  })

  return url
}
