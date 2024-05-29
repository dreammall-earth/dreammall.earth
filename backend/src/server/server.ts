import { createServer as createHttpServer } from 'http'

import { ApolloServer, ApolloServerPlugin } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
// import { startStandaloneServer } from '@apollo/server/standalone'
import cors from 'cors'
import express, { json, urlencoded } from 'express'

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
  const app = express()

  const httpServer = createHttpServer(app)

  const apolloServer = await createServer()

  await apolloServer.start()

  app.use(json())
  app.use(urlencoded({ extended: true }))

  app.use(cors<cors.CorsRequest>())

  app.use(
    expressMiddleware(apolloServer, {
      // eslint-disable-next-line @typescript-eslint/require-await
      context: async ({ req }) => ({ token: getToken(req.headers.authorization) }),
    }),
  )

  /*
  const { url } = await startStandaloneServer(await createServer(), {
    listen: { port },
    // eslint-disable-next-line @typescript-eslint/require-await
    context: async ({ req }): Promise<Context> => ({
      token: getToken(req.headers.authorization),
    }),
  })
  */

  httpServer.listen({ port })
}
