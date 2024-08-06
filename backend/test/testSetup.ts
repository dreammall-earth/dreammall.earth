// eslint-disable-next-line import/no-unassigned-import
import 'reflect-metadata'
import path from 'path'

import { config } from 'dotenv'

import logger from '#src/logger'

config({
  path: path.resolve(__dirname, '../.env.dist'),
})

// Only display log level warn
logger.settings.minLevel = 4
