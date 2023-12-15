import { startStandaloneServer } from '@apollo/server/standalone'

import { listen } from './server'

jest.mock('#config/config', () => {
  return {
    BREVO_KEY: '',
    BREVO_CONTACT_REQUEST_TO_NAME: 'Peter Lustig',
    BREVO_CONTACT_REQUEST_TO_EMAIL: 'peter@lustig.de',
    BREVO_TEMPLATE_CONTACT_BASE: '1',
    BREVO_TEMPLATE_CONTACT_USER: '2',
  }
})

jest.mock('@apollo/server/standalone', () => {
  const originalModule = jest.requireActual<typeof import('@apollo/server/standalone')>(
    '@apollo/server/standalone',
  )
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
