import path from 'path'

import { config } from 'dotenv'

// Load env file
config({
  path: path.resolve(__dirname, '../../.env'),
})

interface ENV {
  BREVO_KEY: string | undefined
  BREVO_CONTACT_REQUEST_TO_NAME: string | undefined
  BREVO_CONTACT_REQUEST_TO_EMAIL: string | undefined
  BREVO_TEMPLATE_CONTACT_BASE: number | undefined
  BREVO_TEMPLATE_CONTACT_USER: number | undefined
}

interface Config {
  BREVO_KEY: string
  BREVO_CONTACT_REQUEST_TO_NAME: string
  BREVO_CONTACT_REQUEST_TO_EMAIL: string
  BREVO_TEMPLATE_CONTACT_BASE: number
  BREVO_TEMPLATE_CONTACT_USER: number
}

/* eslint-disable n/no-process-env */
const getConfig = (): ENV => {
  return {
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
}
/* eslint-enable n/no-process-env */

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      // eslint-disable-next-line no-console
      console.warn(`Missing key ${key} in config.env`)
    }
  }
  return config as Config
}

const configEnv = getConfig()
const sanitizedConfig = getSanitzedConfig(configEnv)

export default sanitizedConfig
