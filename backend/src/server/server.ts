import { createServer as createHttpServer, Server } from 'http'

import { ApolloServer, ApolloServerPlugin } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import cors from 'cors'
import express, { json, urlencoded } from 'express'

import { schema } from '#graphql/schema'

import { Context, getContextToken, GetContextToken } from './context'
import logger from './logger'

export const createServer = async (
  withLogger: boolean = true,
  httpServer: Server | undefined = undefined,
): Promise<ApolloServer> => {
  const plugins: ApolloServerPlugin<Context>[] = []
  if (withLogger) plugins.push(logger)
  if (httpServer) plugins.push(ApolloServerPluginDrainHttpServer({ httpServer }))
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

  const apolloServer = await createServer(true, httpServer)

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

  httpServer.listen({ port })
}
