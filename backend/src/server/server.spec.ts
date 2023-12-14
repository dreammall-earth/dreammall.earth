import { startStandaloneServer } from '@apollo/server/standalone'

import { listen } from './server'

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

jest.mock('../config/config', () => {
  // eslint-disable-next-line n/no-process-env
  process.env.BREVO_KEY = ''
  // eslint-disable-next-line n/no-process-env
  process.env.BREVO_CONTACT_REQUEST_TO_NAME = ''
  // eslint-disable-next-line n/no-process-env
  process.env.BREVO_CONTACT_REQUEST_TO_EMAIL = ''
  // eslint-disable-next-line n/no-process-env
  process.env.BREVO_TEMPLATE_CONTACT_BASE = '1'
  // eslint-disable-next-line n/no-process-env
  process.env.BREVO_TEMPLATE_CONTACT_USER = '2'
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
