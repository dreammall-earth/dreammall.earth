import { startStandaloneServer } from '@apollo/server/standalone'

import { listen } from './server'

jest.mock('@apollo/server/standalone', () => {
  const originalModule = jest.requireActual('@apollo/server/standalone')
  return {
    __esModule: true,
    ...originalModule,
    startStandaloneServer: jest.fn(() => {
      return {
        url: 'url',
      }
    }),
  }
})

describe('server', () => {
  describe('listen', () => {
    beforeEach(async () => {
      jest.clearAllMocks()
      await listen(4000)
    })

    it('calls startStandaloneServer', () => {
      expect(startStandaloneServer).toBeCalled()
    })
  })
})
