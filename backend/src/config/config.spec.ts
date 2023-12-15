import config from './config'

// TODO: Check how testSetup tests the non present process.env attributes
jest.mock('./config', () => {
  // eslint-disable-next-line n/no-process-env
  process.env.BREVO_KEY = ''
  // eslint-disable-next-line n/no-process-env
  process.env.BREVO_CONTACT_REQUEST_TO_NAME = 'Peter Lustig'
  // eslint-disable-next-line n/no-process-env
  process.env.BREVO_CONTACT_REQUEST_TO_EMAIL = 'peter@lustig.de'
  // eslint-disable-next-line n/no-process-env
  process.env.BREVO_TEMPLATE_CONTACT_BASE = '1'
  // eslint-disable-next-line n/no-process-env
  process.env.BREVO_TEMPLATE_CONTACT_USER = '2'

  const originalModule = jest.requireActual<typeof import('./config')>('./config')
  return {
    __esModule: true,
    ...originalModule,
  }
})

describe('config', () => {
  it('BREVO_KEY', () => {
    expect(config.BREVO_KEY).toBe('')
  })

  it('BREVO_CONTACT_REQUEST_TO_NAME', () => {
    expect(config.BREVO_CONTACT_REQUEST_TO_NAME).toBe('Peter Lustig')
  })

  it('BREVO_CONTACT_REQUEST_TO_NAME', () => {
    expect(config.BREVO_CONTACT_REQUEST_TO_EMAIL).toBe('peter@lustig.de')
  })

  it('BREVO_TEMPLATE_CONTACT_BASE', () => {
    expect(config.BREVO_TEMPLATE_CONTACT_BASE).toBe(1)
  })

  it('BREVO_TEMPLATE_CONTACT_USER', () => {
    expect(config.BREVO_TEMPLATE_CONTACT_USER).toBe(2)
  })
})
