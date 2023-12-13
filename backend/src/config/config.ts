import dotenv from 'dotenv'
import path from 'path'

// Load env file
dotenv.config({
  path: path.resolve(__dirname, '~/.env')
})

interface ENV {
  BREVO_KEY: string | undefined
}

interface Config {
  BREVO_KEY: string
}

const getConfig = (): ENV => {
  return {
    BREVO_KEY: process.env.BREVO_KEY,
  }
}

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`)
    }
  }
  return config as Config
}

const config = getConfig()
const sanitizedConfig = getSanitzedConfig(config)

export default sanitizedConfig