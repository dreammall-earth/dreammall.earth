/* eslint-disable n/no-process-env */
import path from 'path'

import { config } from 'dotenv'

import { printConfigError } from './printConfigError'

// Load env file
config({
  path: path.resolve(__dirname, '../../.env'),
})

// Config
const BREVO = {
  BREVO_KEY: process.env.BREVO_KEY,
  BREVO_CONTACT_REQUEST_TO_NAME: process.env.BREVO_CONTACT_REQUEST_TO_NAME,
  BREVO_CONTACT_REQUEST_TO_EMAIL: process.env.BREVO_CONTACT_REQUEST_TO_EMAIL,
  BREVO_TEMPLATE_CONTACT_BASE: !isNaN(Number(process.env.BREVO_TEMPLATE_CONTACT_BASE))
    ? Number(process.env.BREVO_TEMPLATE_CONTACT_BASE)
    : undefined,
  BREVO_TEMPLATE_CONTACT_USER: !isNaN(Number(process.env.BREVO_TEMPLATE_CONTACT_USER))
    ? Number(process.env.BREVO_TEMPLATE_CONTACT_USER)
    : undefined,
  BREVO_CONTACT_LIST_ID: !isNaN(Number(process.env.BREVO_CONTACT_LIST_ID))
    ? Number(process.env.BREVO_CONTACT_LIST_ID)
    : undefined,
}

export const CONFIG = { ...BREVO }

// Config Checks
export const CONFIG_CHECKS = {
  CONFIG_CHECK_BREVO_SEND_CONTACT: (
    config: typeof CONFIG,
  ): config is typeof CONFIG & {
    BREVO_KEY: string
    BREVO_TEMPLATE_CONTACT_BASE: number
    BREVO_TEMPLATE_CONTACT_USER: number
    BREVO_CONTACT_REQUEST_TO_NAME: string
    BREVO_CONTACT_REQUEST_TO_EMAIL: string
  } =>
    typeof config.BREVO_KEY === 'string' &&
    typeof config.BREVO_TEMPLATE_CONTACT_BASE === 'number' &&
    typeof config.BREVO_TEMPLATE_CONTACT_USER === 'number' &&
    typeof config.BREVO_CONTACT_REQUEST_TO_NAME === 'string' &&
    typeof config.BREVO_CONTACT_REQUEST_TO_EMAIL === 'string',
  CONFIG_CHECK_BREVO_SUBSCRIBE_NEWSLETTER: (
    config: typeof CONFIG,
  ): config is typeof CONFIG & { BREVO_KEY: string; BREVO_CONTACT_LIST_ID: number } =>
    typeof config.BREVO_KEY === 'string' && typeof config.BREVO_CONTACT_LIST_ID === 'number',
}

const validateConfig = () => {
  if (!CONFIG_CHECKS.CONFIG_CHECK_BREVO_SEND_CONTACT(CONFIG)) {
    printConfigError(
      'BREVO_SEND_CONTACT functionality is disabled - some BREVO configs are missing',
    )
  }

  if (!CONFIG_CHECKS.CONFIG_CHECK_BREVO_SUBSCRIBE_NEWSLETTER(CONFIG)) {
    printConfigError(
      'BREVO_SUBSCRIBE_NEWSLETTER functionality is disabled - some BREVO configs are missing',
    )
  }
}

validateConfig()
