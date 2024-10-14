import { ApolloServer } from '@apollo/server'
import { buildSchema, Resolver, Query, Float, AuthenticationError } from 'type-graphql'

import { createApolloPlugin } from './createApolloPlugin'

import type { Scope, withScope } from '@sentry/node'

@Resolver()
class ExampleResolver {
  @Query(() => Boolean)
  successFullQuery(): boolean {
    return true
  }

  @Query(() => Float)
  internalServerError(): number {
    throw new Error('That hurts!')
  }

  @Query(() => Float)
  unauthorized(): number {
    throw new AuthenticationError(
      'Access denied! You need to be authenticated to perform this action!',
    )
  }
}

describe('createApolloPlugin', () => {
  beforeEach(jest.clearAllMocks)

  const mockCaptureException = jest.fn()

  const mockWithScope = ((
    // eslint-disable-next-line promise/prefer-await-to-callbacks
    cb: (scope: Pick<Scope, 'setTag' | 'setExtra' | 'addBreadcrumb'>) => undefined,
  ) => {
    const fakeScope = {
      setTag: jest.fn(),
      setExtra: jest.fn(),
      addBreadcrumb: jest.fn(),
    }
    // eslint-disable-next-line promise/prefer-await-to-callbacks
    return cb(fakeScope)
  }) as typeof withScope
  const sentry = {
    captureException: mockCaptureException,
    withScope: mockWithScope,
  }

  describe('if dsn is undefined', () => {
    it('returns empty object', () => {
      const dsn = undefined
      expect(createApolloPlugin({ dsn }, sentry)).toEqual({})
    })
  })

  describe('if dsn is set', () => {
    it('returns a pluggable apollo server plugin with a `requestDidStart` hook', () => {
      const dsn = 'something'
      expect(createApolloPlugin({ dsn }, sentry)).toMatchObject({
        requestDidStart: expect.any(Function) as unknown,
      })
    })
  })

  describe('applied on an apollo server', () => {
    const setup = async () => {
      const dsn = 'something'
      const plugin = createApolloPlugin({ dsn }, sentry)
      const schema = await buildSchema({
        resolvers: [ExampleResolver],
      })
      return new ApolloServer<never>({
        schema,
        plugins: [plugin],
      })
    }

    describe('when the resolver responds with no errors', () => {
      const query = '{ successFullQuery }'

      it('responds with some data and no errors', async () => {
        const server = await setup()
        await expect(server.executeOperation({ query })).resolves.toMatchObject({
          body: {
            kind: 'single',
            singleResult: {
              data: {
                successFullQuery: true,
              },
              errors: undefined,
            },
          },
        })
      })

      it('does not report anything', async () => {
        const server = await setup()
        await server.executeOperation({ query })
        expect(sentry.captureException).not.toHaveBeenCalled()
      })
    })

    describe('on internal server error', () => {
      const query = `{ internalServerError }`

      it('responds some errors', async () => {
        const server = await setup()
        await expect(server.executeOperation({ query })).resolves.toMatchObject({
          body: {
            kind: 'single',
            singleResult: {
              data: null,
              errors: [
                {
                  locations: [
                    {
                      column: 3,
                      line: 1,
                    },
                  ],
                  message: 'That hurts!',
                  path: ['internalServerError'],
                },
              ],
            },
          },
        })
      })

      it('reports the error', async () => {
        const server = await setup()
        await server.executeOperation({ query })
        expect(sentry.captureException).toHaveBeenCalledWith(new Error('That hurts!'))
      })
    })

    describe('but on AuthenticationError', () => {
      const query = `{ unauthorized }`

      it('ignores the error', async () => {
        const server = await setup()
        await server.executeOperation({ query })
        expect(sentry.captureException).not.toHaveBeenCalled()
      })
    })

    describe('and on invalid graphql queries', () => {
      const query = `{ doesntExist }`

      it('ignores the error', async () => {
        const server = await setup()
        await server.executeOperation({ query })
        expect(sentry.captureException).not.toHaveBeenCalled()
      })
    })
  })
})
