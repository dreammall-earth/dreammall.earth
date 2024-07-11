import { ApolloServer } from '@apollo/server'

import { prisma } from '#src/prisma'
import { createTestServer } from '#src/server/server'

let testServer: ApolloServer

beforeAll(async () => {
  testServer = await createTestServer()
})

describe('UserResolver', () => {
  describe('users query', () => {
    describe('unauthenticated', () => {
      it('returns an unauthenticated error', async () => {
        const response = await testServer.executeOperation({
          query: `{users {id name username}}`,
        })
        expect(response.body).toMatchObject({
          body: {
            kind: 'single',
            singleResult: {
              data: null,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              errors: expect.arrayContaining([
                expect.objectContaining({
                  message: 'Access denied! You need to be authenticated to perform this action!',
                }),
              ]),
            },
          },
        })
      })
    })
    describe('authenticated', () => {
      it('returns a list of users', async () => {
        const response = await testServer.executeOperation({
          query: `{users {id name username}}`,
        })
        expect(response.body).toMatchObject({
          kind: 'single',
          singleResult: {
            data: {
              users: [],
            },
            errors: undefined,
          },
        })
      })
    })
  })
})
