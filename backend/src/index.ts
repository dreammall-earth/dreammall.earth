// eslint-disable-next-line import/no-unassigned-import
import 'reflect-metadata'

import logger from './logger'
import { prisma } from './prisma'
import { listen } from './server/server'

export const main = async (): Promise<void> => {
  await listen(4000)
  logger.info(`🚀 Server is ready at http://localhost:4000/`)
}

void main()
  .catch((e) => {
    logger.error(e)
    throw e
  })
  .finally(() => {
    void prisma.$disconnect()
  })
