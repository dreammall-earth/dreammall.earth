import { ApolloServer } from '@apollo/server'
// import { faker } from '@faker-js/faker'

import { findOrCreateUser } from '#src/context/findOrCreateUser'
import { prisma } from '#src/prisma'
import { createTestServer } from '#src/server/server'
import { mockContextValue } from '#test/mockContextValue'
// import { prisma } from '#src/prisma'

import type { Context } from '#src/context'
import type { UserWithProfile } from '#src/prisma'

// import { MAX_STARS_TO_SHOW } from './StarmapResolver'
// import { StarMap } from '#models/StarModel'

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
        it('returns the starmap with the authenticated user in the center', async () => {
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
                        azimuth: 0.0,
                        altitude: 0.0,
                        distance: 1,
                        magnitude: 1.5,
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

      describe('two more users in the database', () => {
        let bibi: UserWithProfile
        let peter: UserWithProfile

        beforeAll(async () => {
          bibi = await findOrCreateUser({ prisma })({
            pk: 43,
            nickname: 'bibi',
            name: 'Bibi Bloxberg',
          })
          peter = await findOrCreateUser({ prisma })({
            pk: 44,
            nickname: 'peter',
            name: 'Peter Lustig',
          })
        })

        it('returns the authenticated user first, the others afterwards', async () => {
          const response = await testServer.executeOperation(
            {
              query,
            },
            { contextValue: mockContextValue({ user: bibi }) },
          )

          expect(response).toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: {
                  starmap: {
                    stars: [
                      {
                        id: `u${bibi.id}`,
                        azimuth: 0.0,
                        altitude: 0.0,
                        distance: 1,
                        magnitude: 1.5,
                        color: 1,
                        data: {
                          id: bibi.id,
                          username: 'bibi',
                          name: 'Bibi Bloxberg',
                          introduction: null,
                          availability: null,
                          details: [],
                          social: [],
                          table: null,
                        },
                      },
                      expect.objectContaining({
                        id: `u${user.id}`,
                      }),
                      expect.objectContaining({
                        id: `u${peter.id}`,
                      }),
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

      // eslint-disable-next-line jest/no-commented-out-tests
      /* How to test this?
      describe('more than MAX_STARS_TO_SHOW users in database', () => {
        beforeAll(async () => {
          await prisma.user.createMany({
            data: Array.from(new Array(MAX_STARS_TO_SHOW + 10), (_, i) => ({
              name: faker.person.fullName(),
              // add index to avoid flaky test
              username: faker.internet.userName() + i,
              // I hope this is not flaky
              referenceId: faker.string.alphanumeric({ length: 8, casing: 'upper', exclude: 'O' }),
            }))
          })
        })

        it('returns only MAX_STARS_TO_SHOW + 1 (current user) stars', async () => {
          const response = await testServer.executeOperation<StarMap>(
            {
              query,
            },
            { contextValue: mockContextValue({ user }) },
          )

          // this says:
          // Property 'singleResult' does not exist on type '{ kind: "incremental"; initialResult: GraphQLExperimentalFormattedInitialIncrementalExecutionResult<ObjMap<unknown>, ObjMap<unknown>>; subsequentResults: AsyncIterable<...>; }'.

          expect(response.body.singleResult.data.starmap.stars).toHaveLength(MAX_STARS_TO_SHOW + 1)
        })
      })
      */
    })
  })
})
