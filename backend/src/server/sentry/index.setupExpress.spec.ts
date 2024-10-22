import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import express, { json } from 'express'
import sentryTestkit from 'sentry-testkit'
import supertest from 'supertest'
import { buildSchema, Resolver, Query } from 'type-graphql'
import waitForExpect from 'wait-for-expect'

import { setupSentry } from '.'

import type { Transport } from '@sentry/types'

const tk = sentryTestkit()
const testkit = tk.testkit
const transport = tk.sentryTransport as () => Transport

@Resolver()
class ExampleResolver {
  @Query(() => Boolean)
  successFullQuery(): boolean {
    return true
  }
}

describe('setupSentry', () => {
  beforeEach(() => testkit.reset())

  describe('any unhandled error', () => {
    let setup: ReturnType<typeof setupSentry>

    beforeAll(() => {
      const dsn =
        'https://398434ec1dc210d86b97cdd3b076bc53@o111205.ingest.us.sentry.io/4508065015922688'
      setup = setupSentry({ dsn, transport })
    })

    describe('setupExpress', () => {
      const createExpressApp = () => {
        const app = express()
        app.get('/crash-me', () => {
          throw new Error('Congrats, you crashed me!')
        })
        setup.setupExpress(app)
        return app
      }

      it('ensures that any errors from request handlers are sent to Sentry', async () => {
        const app = createExpressApp()
        await supertest(app).get('/crash-me').expect(500)
        await waitForExpect(() => expect(testkit.reports().length).toBeGreaterThan(0))
        expect(testkit.findReport(new Error('Congrats, you crashed me!'))).toBeDefined()
      })
    })

    describe('apolloPlugin', () => {
      const createExpressApolloServer = async () => {
        const app = express()
        const schema = await buildSchema({
          resolvers: [ExampleResolver],
        })
        const apolloServer = new ApolloServer<never>({
          schema,
          plugins: [setup.apolloPlugin],
        })
        await apolloServer.start()
        const context = () => {
          throw new Error('Oh no! Error during context creation!')
        }
        app.use(json())
        app.use(expressMiddleware(apolloServer, { context }))
        setup.setupExpress(app)
        return app
      }

      it('sends errors on apollo server context creation to Sentry', async () => {
        const app = await createExpressApolloServer()
        await supertest(app)
          .post('/graphql')
          .send({ query: '{ successFullQuery }' })
          .set('Content-Type', 'application/json')
          .expect(500)
        await waitForExpect(() => expect(testkit.reports().length).toBeGreaterThan(0))
        expect(testkit.findReport(new Error('Oh no! Error during context creation!'))).toBeDefined()
      })
    })
  })
})
