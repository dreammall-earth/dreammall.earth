/* eslint-disable n/no-process-env */
import path from 'path'

import { config } from 'dotenv'

// Load env file
config({
  path: path.resolve(__dirname, '../../.env'),
})

const BREVO = {
  BREVO_KEY: process.env.BREVO_KEY,
  BREVO_CONTACT_REQUEST_TO_NAME: process.env.BREVO_CONTACT_REQUEST_TO_NAME,
  BREVO_CONTACT_REQUEST_TO_EMAIL: process.env.BREVO_CONTACT_REQUEST_TO_EMAIL,
  BREVO_TEMPLATE_CONTACT_BASE: process.env.BREVO_TEMPLATE_CONTACT_BASE
    ? Number(process.env.BREVO_TEMPLATE_CONTACT_BASE)
    : undefined,
  BREVO_TEMPLATE_CONTACT_USER: process.env.BREVO_TEMPLATE_CONTACT_USER
    ? Number(process.env.BREVO_TEMPLATE_CONTACT_USER)
    : undefined,
}

export const printConfigError = (error: string) => {
  switch (process.env.NODE_ENV) {
    case 'test':
      return
    case 'production':
      throw new Error(error)
    default:
      // eslint-disable-next-line no-console
      console.warn(error)
  }
}
const validateConfig = () => {
  if (!BREVO.BREVO_KEY) {
    printConfigError('Missing BREVO_KEY in config')
  }

  if (
    BREVO.BREVO_KEY &&
    (!BREVO.BREVO_CONTACT_REQUEST_TO_EMAIL ||
      !BREVO.BREVO_CONTACT_REQUEST_TO_NAME ||
      !BREVO.BREVO_TEMPLATE_CONTACT_BASE ||
      !BREVO.BREVO_TEMPLATE_CONTACT_USER)
  ) {
    printConfigError('BREVO_KEY is set, but one or more of the required BREVO configs are missing')
  }
}

validateConfig()

export default { ...BREVO }
