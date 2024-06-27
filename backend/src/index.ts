// eslint-disable-next-line import/no-unassigned-import
import 'reflect-metadata'
import { handleOpenRooms } from '#graphql/resolvers/dal/handleOpenRooms'

import logger from './logger'
import { prisma } from './prisma'
import { listen } from './server/server'

const checkForOpenRooms = (): void => {
  void handleOpenRooms()
  setTimeout(checkForOpenRooms, 60 * 1000)
}

export const main = async (): Promise<void> => {
  const url = await listen(4000)
  logger.info(`🚀 Server is ready at ${url}`)
  setTimeout(checkForOpenRooms, 60 * 1000)
}

void main()
  .catch((e) => {
    logger.error(e)
    throw e
  })
  .finally(() => {
    void prisma.$disconnect()
  })
