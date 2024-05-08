import { ApolloServer } from '@apollo/server'

import { CONFIG } from '#config/config'
import { prisma } from '#src/prisma'
import { createTestServer } from '#src/server/server'

CONFIG.ROOM_LINK = 'http://bbb.dreammall.earth'

let testServer: ApolloServer

beforeAll(async () => {
  testServer = await createTestServer()
})

describe('RoomResolver', () => {
  describe('unauthorized', () => {
    describe('getRoom Quey', () => {
      it('throws access denied error', async () => {
        await expect(
          testServer.executeOperation({
            query: 'query { getRoom }',
          }),
        ).resolves.toMatchObject({
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

    describe('createMyRoom', () => {
      it('throws access denied', async () => {
        await expect(
          testServer.executeOperation({
            query: 'mutation($name: String!) { createMyRoom(name: $name) { id } }',
            variables: { name: 'My Room' },
          }),
        ).resolves.toMatchObject({
          body: {
            kind: 'single',
            singleResult: {
              data: { createMyRoom: null },
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
  })

  describe('authorized', () => {
    describe('getRoom Quey', () => {
      it('returns the room link', async () => {
        await expect(
          testServer.executeOperation(
            {
              query: 'query { getRoom }',
            },
            {
              contextValue: {
                token: 'token',
              },
            },
          ),
        ).resolves.toMatchObject({
          body: {
            kind: 'single',
            singleResult: {
              data: {
                getRoom: 'http://bbb.dreammall.earth',
              },
            },
          },
        })
      })
    })

    describe('createMyRoom', () => {
      describe.skip('no user in context', () => {
        it('returns null', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: 'mutation($name: String!) { createMyRoom(name: $name) { id } }',
                variables: { name: 'My Room' },
              },
              {
                contextValue: {
                  token: 'token',
                  user: undefined,
                },
              },
            ),
          ).resolves.toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: { createMyRoom: null },
                errors: undefined,
              },
            },
          })
        })
      })

      describe('meeting does not exist', () => {
        it('returns Room', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: 'mutation($name: String!) { createMyRoom(name: $name) { id name } }',
                variables: { name: 'My Room' },
              },
              {
                contextValue: {
                  token: 'token',
                  user: undefined,
                },
              },
            ),
          ).resolves.toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: {
                  createMyRoom: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    id: expect.any(Number),
                    name: 'My Room',
                  },
                },
                errors: undefined,
              },
            },
          })
        })

        it('creates meeting in database', async () => {
          await expect(
            prisma.user.findFirst({
              include: {
                meeting: true,
              },
            }),
          ).resolves.toMatchObject({
            meeting: {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              id: expect.any(Number),
              name: 'My Room',
            },
          })
        })
      })

      describe('meeting exists', () => {
        it('returns existing Room', async () => {
          await expect(
            testServer.executeOperation(
              {
                query: 'mutation($name: String!) { createMyRoom(name: $name) { id name } }',
                variables: { name: 'New Room' },
              },
              {
                contextValue: {
                  token: 'token',
                  user: undefined,
                },
              },
            ),
          ).resolves.toMatchObject({
            body: {
              kind: 'single',
              singleResult: {
                data: {
                  createMyRoom: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    id: expect.any(Number),
                    name: 'My Room',
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
