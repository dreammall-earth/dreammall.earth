import { ApolloServer } from '@apollo/server'

import { findOrCreateUser } from '#src/context/findOrCreateUser'
import { prisma } from '#src/prisma'
import { createTestServer } from '#src/server/server'
import { mockContextValue } from '#test/mockContextValue'

import type { Context } from '#src/context'
import type { UserWithProfile } from '#src/prisma'

const pk = 42
const nickname = 'mockedUser'
const name = 'User'

let testServer: ApolloServer<Context>

describe('StarmapResolver', () => {
  beforeAll(async () => {
    testServer = await createTestServer()
  })

  const query = `
query {
  starmap {
    stars {
      id
      azimuth
      altitude
      distance
      magnitude
      color
      data {
        id
        username
        name
        introduction
        availability
        details {
          category
          text
        }
        social {
          type
          link
        }
        table {
          id
        }
      }
    }
    starLines {
      from
      to
    }
  }
}`

  describe('starmap query', () => {
    describe('unauthenticated', () => {
      it('returns an unauthenticated error', async () => {
        const response = await testServer.executeOperation(
          {
            query,
          },
          { contextValue: mockContextValue() },
        )
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
      let user: UserWithProfile
      beforeEach(async () => {
        user = await findOrCreateUser({ prisma })({ pk, nickname, name })
      })

      describe('only the authenticated user in DB', () => {
        it('returns the starmap', async () => {
          const response = await testServer.executeOperation(
            {
              query,
            },
            { contextValue: mockContextValue({ user }) },
          )

          expect(response).toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: {
                  starmap: {
                    stars: [
                      {
                        id: `u${user.id}`,
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        azimuth: expect.any(Number),
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        altitude: expect.any(Number),
                        distance: 1,
                        magnitude: 1,
                        color: 1,
                        data: {
                          id: user.id,
                          username: user.username,
                          name: user.name,
                          introduction: null,
                          availability: null,
                          details: [],
                          social: [],
                          table: null,
                        },
                      },
                    ],
                    starLines: [],
                  },
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
