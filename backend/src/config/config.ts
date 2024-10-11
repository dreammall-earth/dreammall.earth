/* eslint-disable n/no-process-env */
import path from 'path'

import { config } from 'dotenv'
// eslint-disable-next-line import/named
import { v4 as uuidv4 } from 'uuid'

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
  NODE_ENV,
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

  WEBHOOK_SECRET,
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
  NODE_ENV,
  WELCOME_TABLE_MEETING_ID,
  WELCOME_TABLE_NAME,
  JWKS_URI,
  SENTRY_DSN,
  SENTRY_ENVIRONMENT,
  WEBHOOK_SECRET,
}
