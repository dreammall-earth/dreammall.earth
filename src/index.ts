import { ApolloServer, gql } from 'apollo-server-express'
import express from 'express'

const typeDefs = gql`
  type Query {
    hello: String
  }
`

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
}

async function listen(port: number) {
  const app: any = express()
  
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })
  await server.start()

  server.applyMiddleware({ app, path: '/' })

  return new Promise((resolve, reject) => {
    app.listen(port).once('listening', resolve).once('error', reject)
  })
}

async function main() {
  try {
    await listen(4000)
    console.log('🚀 Server is ready at http://localhost:4000/graphql')
  } catch (err) {
    console.error('💀 Error starting the node server', err)
  }
}

void main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e)
  throw e
})
