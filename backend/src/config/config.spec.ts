/* eslint-disable import/no-unassigned-import */
/* eslint-disable n/global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable n/no-missing-require */
/* eslint-disable n/no-process-env */
let mockPrintConfigError: jest.SpyInstance

describe('validateConfig', () => {
  describe('check CONFIG_CHECK_BREVO_SEND_CONTACT', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      jest.resetModules()
      mockPrintConfigError = jest
        .spyOn(require('./printConfigError'), 'printConfigError')
        .mockImplementation()
      process.env.BREVO_KEY = 'MY KEY'
      process.env.BREVO_ADMIN_NAME = 'Peter Lustig'
      process.env.BREVO_ADMIN_EMAIL = 'peter@lustig.de'
      process.env.BREVO_CONTACT_TEMPLATE_ADMIN = 'not a number'
      process.env.BREVO_CONTACT_TEMPLATE_USER = 'not a number'
      process.env.BREVO_NEWSLETTER_TEMPLATE_OPTIN = 'not a number'
      require('#config/config')
    })

    it('fails the check', () => {
      expect(mockPrintConfigError).toHaveBeenCalledWith(
        'BREVO_SEND_CONTACT functionality is disabled - some BREVO configs are missing',
      )
    })
  })

  describe('check CONFIG_CHECK_BREVO_SUBSCRIBE_NEWSLETTER', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      jest.resetModules()
      mockPrintConfigError = jest
        .spyOn(require('./printConfigError'), 'printConfigError')
        .mockImplementation()
      process.env.BREVO_KEY = 'MY KEY'
      process.env.BREVO_NEWSLETTER_LIST = 'not a number'
      require('#config/config')
    })

    it('fails the check', () => {
      expect(mockPrintConfigError).toHaveBeenCalledWith(
        'BREVO_SUBSCRIBE_NEWSLETTER functionality is disabled - some BREVO configs are missing',
      )
    })
  })

  describe('check valid config', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      jest.resetModules()
      mockPrintConfigError = jest
        .spyOn(require('./printConfigError'), 'printConfigError')
        .mockImplementation()
      process.env.BREVO_KEY = 'MY KEY'
      process.env.BREVO_ADMIN_NAME = 'Peter Lustig'
      process.env.BREVO_ADMIN_EMAIL = 'peter@lustig.de'
      process.env.BREVO_CONTACT_TEMPLATE_ADMIN = '1'
      process.env.BREVO_CONTACT_TEMPLATE_USER = '2'
      process.env.BREVO_NEWSLETTER_LIST = '3'
      process.env.BREVO_NEWSLETTER_TEMPLATE_OPTIN = '3'
      require('#config/config')
    })

    it('passes all checks', () => {
      expect(mockPrintConfigError).toHaveBeenCalledTimes(0)
    })
  })
})
