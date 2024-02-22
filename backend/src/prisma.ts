import { PrismaClient } from '@prisma/client'
import { createSoftDeleteExtension } from 'prisma-extension-soft-delete'

import logger from './logger'

const prismaClient = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
})

prismaClient.$on('query', (e) => {
  logger.debug('Prisma Query', e)
})

const prisma = prismaClient.$extends(
  createSoftDeleteExtension({
    models: {
      NewsletterPreOptIn: true,
      NewsletterSubscription: true,
    },
    defaultConfig: {
      field: 'deletedAt',
      createValue: (deleted) => {
        if (deleted) return new Date()
        return null
      },
    },
  }),
)

export { prisma }
