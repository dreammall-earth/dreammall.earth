import { PrismaClient } from '@prisma/client'
import { createSoftDeleteExtension } from 'prisma-extension-soft-delete'

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
  // eslint-disable-next-line no-console
  console.log('Prisma Query', e)
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
