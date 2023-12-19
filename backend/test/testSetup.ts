// eslint-disable-next-line import/no-unassigned-import
import 'reflect-metadata'
import path from 'path'

import { config } from 'dotenv'

config({
  path: path.resolve(__dirname, '../.env.test'),
})
