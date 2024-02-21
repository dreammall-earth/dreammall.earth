import { PrismaClient } from '@prisma/client'

import logger from '#src/logger'

const prisma = new PrismaClient()

async function main() {}

main()
  .then(async () => {
    await prisma.$disconnect()
    return undefined
  })
  .catch(async (e) => {
    logger.error(e)
    await prisma.$disconnect()
    throw e
  })
