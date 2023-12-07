import { ApolloServer } from '@apollo/server'

import { prisma } from '#src/prisma'
import { createServer } from '#src/server/server'

let testServer: ApolloServer

beforeAll(async () => {
  testServer = await createServer()
})

describe('HelloResolver', () => {
  describe('with no data', () => {
    it('returns "no data found"', async () => {
      const response = await testServer.executeOperation({
        query: '{ hello { hello } }',
      })
      expect(response.body).toMatchObject({
        kind: 'single',
        singleResult: {
          data: {
            hello: {
              hello: 'no data found',
            },
          },
        },
      })
    })
  })

  describe('with data', () => {
    it('returns "Hello World!"', async () => {
      await prisma.hello.create({
        data: {
          text: 'Hello World!',
        },
      })
      const response = await testServer.executeOperation({
        query: '{ hello { hello } }',
      })
      expect(response.body).toMatchObject({
        kind: 'single',
        singleResult: {
          data: {
            hello: {
              hello: 'Hello World!',
            },
          },
        },
      })
    })
  })
})
