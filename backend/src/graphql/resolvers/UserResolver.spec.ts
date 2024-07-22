import { ApolloServer } from '@apollo/server'

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
        expect(response).toMatchObject({
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

      describe('include self is false', () => {
        it('returns an empty list of users', async () => {
          const response = await testServer.executeOperation(
            {
              query: `{users {id name username}}`,
            },
            {
              contextValue: {
                token: 'token',
                user: undefined,
              },
            },
          )
          expect(response).toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: {
                  users: [],
                },
                errors: undefined,
              },
            },
          })
        })
      })

      describe('include self is true', () => {
        it('returns a list of users', async () => {
          const response = await testServer.executeOperation(
            {
              query: `query ($includeSelf: Boolean) {users(includeSelf: $includeSelf) {id name username}}`,
              variables: { includeSelf: true },
            },
            {
              contextValue: {
                token: 'token',
                user: undefined,
              },
            },
          )
          expect(response).toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: {
                  users: [
                    {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      id: expect.any(Number),
                      name: 'User',
                      username: 'mockedUser',
                    },
                  ],
                },
                errors: undefined,
              },
            },
          })
        })
      })
    })
  })
})
