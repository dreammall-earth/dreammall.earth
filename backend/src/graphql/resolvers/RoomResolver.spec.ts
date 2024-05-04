import { ApolloServer } from '@apollo/server'

import { CONFIG } from '#config/config'
import { createTestServer } from '#src/server/server'

CONFIG.ROOM_LINK = 'http://bbb.dreammall.earth'

let testServer: ApolloServer

beforeAll(async () => {
  testServer = await createTestServer()
})

describe('RoomResolver', () => {
  describe('unauthorized', () => {
    describe('getRoom Quey', () => {
      it('returns the room link', async () => {
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
  })
})
