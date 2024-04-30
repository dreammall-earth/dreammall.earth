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
  BREVO_ADMIN_NAME: process.env.BREVO_ADMIN_NAME,
  BREVO_ADMIN_EMAIL: process.env.BREVO_ADMIN_EMAIL,
  BREVO_CONTACT_TEMPLATE_ADMIN: !isNaN(Number(process.env.BREVO_CONTACT_TEMPLATE_ADMIN))
    ? Number(process.env.BREVO_CONTACT_TEMPLATE_ADMIN)
    : undefined,
  BREVO_CONTACT_TEMPLATE_USER: !isNaN(Number(process.env.BREVO_CONTACT_TEMPLATE_USER))
    ? Number(process.env.BREVO_CONTACT_TEMPLATE_USER)
    : undefined,
  BREVO_NEWSLETTER_TEMPLATE_OPTIN: !isNaN(Number(process.env.BREVO_NEWSLETTER_TEMPLATE_OPTIN))
    ? Number(process.env.BREVO_NEWSLETTER_TEMPLATE_OPTIN)
    : undefined,
  BREVO_NEWSLETTER_LIST: !isNaN(Number(process.env.BREVO_NEWSLETTER_LIST))
    ? Number(process.env.BREVO_NEWSLETTER_LIST)
    : undefined,
}

const ROOMS = {
  ROOM_LINK: process.env.ROOM_LINK ?? 'http://my-room.earth',
}

const BBB = {
  BBB_SHARED_SECRET: process.env.BBB_SHARED_SECRET ?? 'unknown',
}

export const CONFIG = {
  ...BREVO,
  ...ROOMS,
  ...BBB,
}

// Config Checks
export const CONFIG_CHECKS = {
  CONFIG_CHECK_BREVO_SEND_CONTACT: (
    config: typeof CONFIG,
  ): config is typeof CONFIG & {
    BREVO_KEY: string
    BREVO_CONTACT_TEMPLATE_ADMIN: number
    BREVO_CONTACT_TEMPLATE_USER: number
    BREVO_ADMIN_NAME: string
    BREVO_ADMIN_EMAIL: string
  } =>
    typeof config.BREVO_KEY === 'string' &&
    typeof config.BREVO_CONTACT_TEMPLATE_ADMIN === 'number' &&
    typeof config.BREVO_CONTACT_TEMPLATE_USER === 'number' &&
    typeof config.BREVO_ADMIN_NAME === 'string' &&
    typeof config.BREVO_ADMIN_EMAIL === 'string',
  CONFIG_CHECK_BREVO_NEWSLETTER: (
    config: typeof CONFIG,
  ): config is typeof CONFIG & {
    BREVO_KEY: string
    BREVO_NEWSLETTER_LIST: number
    BREVO_NEWSLETTER_TEMPLATE_OPTIN: number
    BREVO_ADMIN_NAME: string
    BREVO_ADMIN_EMAIL: string
  } =>
    typeof config.BREVO_KEY === 'string' &&
    typeof config.BREVO_NEWSLETTER_LIST === 'number' &&
    typeof config.BREVO_NEWSLETTER_TEMPLATE_OPTIN === 'number' &&
    typeof config.BREVO_ADMIN_NAME === 'string' &&
    typeof config.BREVO_ADMIN_EMAIL === 'string',
}

const validateConfig = () => {
  if (!CONFIG_CHECKS.CONFIG_CHECK_BREVO_SEND_CONTACT(CONFIG)) {
    printConfigError(
      'BREVO_SEND_CONTACT functionality is disabled - some BREVO configs are missing',
    )
  }

  if (!CONFIG_CHECKS.CONFIG_CHECK_BREVO_NEWSLETTER(CONFIG)) {
    printConfigError('BREVO_NEWSLETTER functionality is disabled - some BREVO configs are missing')
  }
}

validateConfig()
