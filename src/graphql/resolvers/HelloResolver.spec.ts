import { ApolloServerTestClient } from 'apollo-server-testing'

import { testEnvironment } from '#test/helpers'

let query: ApolloServerTestClient['query']

beforeAll(async () => {
  const testEnv = await testEnvironment()
  query = testEnv.query
})

describe('HelloResolver', () => {
  it('return "Hello World!"', async () => {
    await expect(query({ query: '{ hello { hello } }' })).resolves.toMatchObject({
      data: {
        hello: {
          hello: 'Hello world!',
        },
      },
    })
  })
})
