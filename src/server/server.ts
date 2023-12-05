import { ApolloServer } from 'apollo-server-express'
import express from 'express'

import { schema } from '#graphql/schema'

export async function listen(port: number) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const app: any = express()

  const server = new ApolloServer({
    schema: await schema(),
  })
  await server.start()

  server.applyMiddleware({ app, path: '/' })

  return app.listen(port)
}
