import { ApolloServer } from '@apollo/server'

import { createServer } from '#src/server/server'

let testServer: ApolloServer

beforeAll(async () => {
  testServer = await createServer()
})

describe('HelloResolver', () => {
  it('return "Hello World!"', async () => {
    const response = await testServer.executeOperation({
      query: '{ hello { hello } }',
    })
    expect(response.body).toMatchObject({
      kind: 'single',
      singleResult: {
        data: {
          hello: {
            hello: 'Hello world!',
          },
        },
      },
    })
  })
})
