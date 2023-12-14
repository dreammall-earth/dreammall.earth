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
}

interface Config {
  BREVO_KEY: string
  BREVO_CONTACT_REQUEST_TO_NAME: string
  BREVO_CONTACT_REQUEST_TO_EMAIL: string
}

/* eslint-disable n/no-process-env */
const getConfig = (): ENV => {
  return {
    BREVO_KEY: process.env.BREVO_KEY,
    BREVO_CONTACT_REQUEST_TO_NAME: process.env.BREVO_CONTACT_REQUEST_TO_NAME,
    BREVO_CONTACT_REQUEST_TO_EMAIL: process.env.BREVO_CONTACT_REQUEST_TO_EMAIL,
  }
}
/* eslint-enable n/no-process-env */

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`)
    }
  }
  return config as Config
}

const configEnv = getConfig()
const sanitizedConfig = getSanitzedConfig(configEnv)

export default sanitizedConfig
