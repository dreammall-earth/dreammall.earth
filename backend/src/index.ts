// eslint-disable-next-line import/no-unassigned-import
import 'reflect-metadata'

import { CONFIG } from '#config/config'
import { checkForOpenRooms } from '#graphql/resolvers/dal/handleOpenRooms'

import logger from './logger'
import { prisma } from './prisma'
import { listen } from './server/server'

export const main = async (): Promise<void> => {
  await listen(4000)
  logger.info(`🚀 Server is ready at http://localhost:4000/`)
  // dirty hack do avoid e2e Tests pulling on BBB
  if (CONFIG.BBB_URL !== 'https://my.url') checkForOpenRooms()
}

void main()
  .catch((e) => {
    logger.error(e)
    throw e
  })
  .finally(() => {
    void prisma.$disconnect()
  })
