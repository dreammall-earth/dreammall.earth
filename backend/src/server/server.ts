import { createServer as createHttpServer, Server } from 'http'

import { ApolloServer, ApolloServerPlugin } from '@apollo/server'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@apollo/server/express4'
import cors from 'cors'
import express, { json, urlencoded } from 'express'

import { schema } from '#graphql/schema'

import { Context, getContextToken, GetContextToken } from './context'
import logger from './logger'
import { CONFIG } from '#config/config'

export const createServer = async (withLogger: boolean = true, httpServer: Server | undefined = undefined): Promise<ApolloServer> => {
  const plugins: ApolloServerPlugin<Context>[] = []
  if (withLogger) plugins.push(logger)
  plugins.push(ApolloServerPluginLandingPageDisabled())
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

  app.use(cors<cors.CorsRequest>({
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    maxAge: 600,
    origin: [
      CONFIG.BBB_WEBHOOKS_ENDPOINT,
    ],
  }))

  app.use(
    expressMiddleware(apolloServer, {
      // eslint-disable-next-line @typescript-eslint/require-await
      context: async ({ req }) => ({ token: getToken(req.headers.authorization) }),
    }),
  )

  app.post(CONFIG.BBB_WEBHOOKS_ENDPOINT +  '/BBBevents', (req, res) => {
    console.log('hallo')
    console.log(req.body)
    res.status(200).end()
  })
  
  httpServer.listen({ port })
}
