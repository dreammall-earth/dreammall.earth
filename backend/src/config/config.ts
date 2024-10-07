/* eslint-disable n/no-process-env */
import path from 'path'

import { config } from 'dotenv'
// eslint-disable-next-line import/named
import { v4 as uuidv4 } from 'uuid'

import { printConfigError } from './printConfigError'

// Load env file
config({
  path: path.resolve(__dirname, '../../.env'),
})

const toNumber = (env: string | undefined): number | undefined => {
  const number = Number(env)
  return isNaN(number) ? undefined : number
}

// Config
const {
  BREVO_KEY,
  BREVO_ADMIN_NAME,
  BREVO_ADMIN_EMAIL,
  BREVO_CONTACT_TEMPLATE_ADMIN,
  BREVO_CONTACT_TEMPLATE_USER,
  BREVO_NEWSLETTER_TEMPLATE_OPTIN,
  BREVO_NEWSLETTER_LIST,

  BBB_SHARED_SECRET = 'unknown',
  BBB_URL = 'https://my.url',
  BBB_WEBHOOK_URL = '',

  FRONTEND_URL = 'http://localhost:3000/',

  JWKS_URI,

  WELCOME_TABLE_MEETING_ID = uuidv4(),
  WELCOME_TABLE_NAME = 'DreamMall Coffeetime',

  SENTRY_DSN,
  SENTRY_ENVIRONMENT,
} = process.env

if (!JWKS_URI) {
  throw new Error('missing environment variable: JWKS_URI')
}

const BREVO = {
  BREVO_KEY,
  BREVO_ADMIN_NAME,
  BREVO_ADMIN_EMAIL,
  BREVO_CONTACT_TEMPLATE_ADMIN: toNumber(BREVO_CONTACT_TEMPLATE_ADMIN),
  BREVO_CONTACT_TEMPLATE_USER: toNumber(BREVO_CONTACT_TEMPLATE_USER),
  BREVO_NEWSLETTER_TEMPLATE_OPTIN: toNumber(BREVO_NEWSLETTER_TEMPLATE_OPTIN),
  BREVO_NEWSLETTER_LIST: toNumber(BREVO_NEWSLETTER_LIST),
}

const BBB_PULL_MEETINGS = process.env.NODE_ENV !== 'test' && BBB_URL

const BBB = {
  BBB_PULL_MEETINGS,
  BBB_SHARED_SECRET,
  BBB_URL,
  BBB_WEBHOOK_URL,
}

const FRONTEND = {
  FRONTEND_URL,
}

export const CONFIG = {
  ...BREVO,
  ...BBB,
  ...FRONTEND,
  WELCOME_TABLE_MEETING_ID,
  WELCOME_TABLE_NAME,
  JWKS_URI,
  SENTRY_DSN,
  SENTRY_ENVIRONMENT,
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
