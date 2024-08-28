// eslint-disable-next-line import/no-unassigned-import
import 'reflect-metadata'

import { periodicallyRegisterWebhook } from '#api/BBB'
import { CONFIG } from '#config/config'

import logger from './logger'
import { prisma } from './prisma'
import { listen } from './server/server'

export const main = async (): Promise<void> => {
  await listen(4000)
  logger.info(`🚀 Server is ready at http://localhost:4000/`)
  if (CONFIG.BBB_WEBHOOK_URL) periodicallyRegisterWebhook()
}

void main()
  .catch((e) => {
    logger.error(e)
    throw e
  })
  .finally(() => {
    void prisma.$disconnect()
  })
