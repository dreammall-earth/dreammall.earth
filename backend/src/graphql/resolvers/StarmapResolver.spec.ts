import { ApolloServer } from '@apollo/server'

import { findOrCreateUser } from '#src/context/findOrCreateUser'
import { prisma } from '#src/prisma'
import { createTestServer } from '#src/server/server'

import type { Context } from '#src/context'
import type { UserWithProfile } from '#src/prisma'

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
          { contextValue: { user: null, dataSources: { prisma } } },
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
        user = await findOrCreateUser({ nickname, name })
      })

      it('returns the starmap', async () => {
        const response = await testServer.executeOperation(
          {
            query,
          },
          {
            contextValue: {
              user,
              dataSources: { prisma },
            },
          },
        )

        expect(response).toMatchObject({
          body: {
            kind: 'single',
            singleResult: {
              data: {
                starmap: {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  stars: expect.any(Array),

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
