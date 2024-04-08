import { ApolloServer } from '@apollo/server'

import { CONFIG } from '#config/config'
import { createServer } from '#src/server/server'

CONFIG.ROOM_LINK = 'http://bbb.dreammall.earth'

let testServer: ApolloServer

beforeAll(async () => {
  testServer = await createServer()
})

describe('RoomResolver', () => {
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
            data: {
              getRoom: 'http://bbb.dreammall.earth',
            },
          },
        },
      })
    })
  })
})
