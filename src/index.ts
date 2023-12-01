// eslint-disable-next-line import/no-unassigned-import
import 'reflect-metadata'

import { ApolloServer } from 'apollo-server-express'
import express from 'express'

import { schema } from './graphql/schema'

async function listen(port: number) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const app: any = express()

  const server = new ApolloServer({
    schema: await schema(),
  })
  await server.start()

  server.applyMiddleware({ app, path: '/' })

  return app.listen(port)
}

async function main() {
  await listen(4000)
  // eslint-disable-next-line no-console
  console.log('🚀 Server is ready at http://localhost:4000/graphql')
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e)
  throw e
})
