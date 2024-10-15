import { createMockConfig } from '#test/mockConfig'
import { createMockLogger } from '#test/mockLogger'

import { validateConfig } from './configChecks'

const logger = createMockLogger()

describe('validateConfig', () => {
  beforeEach(jest.clearAllMocks)

  describe('check CONFIG_CHECK_BREVO_SEND_CONTACT', () => {
    it('fails the check', () => {
      const config = {
        ...createMockConfig(),
        NODE_ENV: 'development',
        BREVO_KEY: 'MY KEY',
        BREVO_ADMIN_NAME: 'Peter Lustig',
        BREVO_ADMIN_EMAIL: 'peter@lustig.de',
        BREVO_CONTACT_TEMPLATE_ADMIN: 'not a number',
        BREVO_CONTACT_TEMPLATE_USER: 'not a number',
        BREVO_NEWSLETTER_TEMPLATE_OPTIN: 'not a number',
      } as unknown as ReturnType<typeof createMockConfig>
      validateConfig({ config, logger })
      expect(logger.warn).toHaveBeenCalledWith(
        'BREVO_SEND_CONTACT functionality is disabled - some BREVO configs are missing',
      )
    })
  })

  describe('check CONFIG_CHECK_BREVO_NEWSLETTER', () => {
    it('fails the check', () => {
      const config = {
        ...createMockConfig(),
        NODE_ENV: 'development',
        BREVO_KEY: 'MY KEY',
        BREVO_NEWSLETTER_LIST: 'not a number',
      } as unknown as ReturnType<typeof createMockConfig>
      validateConfig({ config, logger })
      expect(logger.warn).toHaveBeenCalledWith(
        'BREVO_NEWSLETTER functionality is disabled - some BREVO configs are missing',
      )
    })
  })

  describe('check valid config', () => {
    it('passes all checks', () => {
      const config = {
        ...createMockConfig(),
        BREVO_KEY: 'MY KEY',
        BREVO_ADMIN_NAME: 'Peter Lustig',
        BREVO_ADMIN_EMAIL: 'peter@lustig.de',
        BREVO_CONTACT_TEMPLATE_ADMIN: '1',
        BREVO_CONTACT_TEMPLATE_USER: '2',
        BREVO_NEWSLETTER_LIST: '3',
        BREVO_NEWSLETTER_TEMPLATE_OPTIN: '3',
      } as unknown as ReturnType<typeof createMockConfig>
      validateConfig({ config, logger })
      expect(logger.warn).toHaveBeenCalledTimes(0)
    })
  })
})
