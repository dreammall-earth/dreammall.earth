import { PrismaClient } from '@prisma/client'
import { createSoftDeleteExtension } from 'prisma-extension-soft-delete'

const prismaClient = new PrismaClient()

const prisma = prismaClient.$extends(
  createSoftDeleteExtension({
    models: {
      NewsletterDoubleOptIn: true,
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
