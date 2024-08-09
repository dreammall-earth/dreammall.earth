import { createServer as createHttpServer, Server } from 'http'

import { ApolloServer, ApolloServerPlugin } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import cors from 'cors'
import express, { json, urlencoded } from 'express'
import { useServer } from 'graphql-ws/lib/use/ws'
import { WebSocketServer } from 'ws'

import { schema } from '#graphql/schema'
import { context } from '#src/context'

import logger from './logger'

import type { Context } from '#src/context'

export const createServer = async (
  withLogger: boolean = true,
  httpServer: Server | undefined = undefined,
  wsServer: ReturnType<typeof useServer> | undefined = undefined,
): Promise<ApolloServer<Context>> => {
  const plugins: ApolloServerPlugin<Context>[] = []
  if (withLogger) plugins.push(logger)
  if (httpServer) plugins.push(ApolloServerPluginDrainHttpServer({ httpServer }))
  if (wsServer)
    plugins.push({
      // eslint-disable-next-line @typescript-eslint/require-await
      async serverWillStart() {
        return {
          async drainServer() {
            await wsServer.dispose()
          },
        }
      },
    })
  return new ApolloServer<Context>({
    schema: await schema(),
    plugins,
  })
}

export const createTestServer = async () => {
  return await createServer(false)
}

export async function listen(port: number) {
  const app = express()

  const httpServer = createHttpServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/subscriptions',
  })

  const serverCleanup = useServer({ schema }, wsServer)

  const apolloServer = await createServer(true, httpServer, serverCleanup)

  await apolloServer.start()

  app.use(json())
  app.use(urlencoded({ extended: true }))

  app.use(cors<cors.CorsRequest>())

  app.use(expressMiddleware(apolloServer, { context }))

  httpServer.listen({ port })
}
