/* eslint-disable n/no-process-env */

import { config } from 'dotenv'
// eslint-disable-next-line import/named
import { v4 as uuidv4 } from 'uuid'

// Load env file
config()

const toNumber = (env: string | undefined): number | undefined => {
  const number = Number(env)
  return isNaN(number) ? undefined : number
}

const toDate = (env: string | undefined): Date | undefined => {
  if (typeof env === 'string') {
    const date = new Date(env)
    if (date.toString() !== 'Invalid date') return date
  }
  return undefined
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

  JWKS_URI = 'http://localhost:9000/application/o/dreammallearth/jwks/',

  WELCOME_TABLE_MEETING_ID = uuidv4(),
  WELCOME_TABLE_NAME = 'DreamMall Coffeetime',

  SENTRY_DSN,
  SENTRY_ENVIRONMENT,

  WEBHOOK_SECRET,

  LOG_LEVEL = 'DEBUG',

  TESTPHASE_DEFAULT,
  TESTPHASE_DURATION_DAYS,
} = process.env

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

const TESTPHASE = {
  TESTPHASE_DEFAULT: toDate(TESTPHASE_DEFAULT),
  TESTPHASE_DURATION_DAYS: toNumber(TESTPHASE_DURATION_DAYS),
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
  LOG_LEVEL,
  ...TESTPHASE,
}
