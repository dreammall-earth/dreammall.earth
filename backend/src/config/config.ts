/* eslint-disable n/no-process-env */
import path from 'path'

import { config } from 'dotenv'

import { validateConfig } from './validateConfig'

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

const CONFIG = { ...BREVO }

validateConfig(CONFIG)

export default CONFIG
