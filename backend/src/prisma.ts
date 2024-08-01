import { Prisma, PrismaClient } from '@prisma/client'
import { createSoftDeleteExtension } from 'prisma-extension-soft-delete'

import logger from './logger'

const prismaClient = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
    {
      emit: 'event',
      level: 'error',
    },
  ],
})

prismaClient.$on('query', (e) => {
  logger.debug('Prisma Query', e)
})
prismaClient.$on('info', (e) => {
  logger.info('Prisma Info', e)
})
prismaClient.$on('warn', (e) => {
  logger.warn('Prisma Warn', e)
})
prismaClient.$on('error', (e) => {
  logger.error('Prisma Error', e)
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

const usersWithMeetings = Prisma.validator<Prisma.UsersInMeetingsDefaultArgs>()({
  include: { user: true },
})

type UsersWithMeetings = Prisma.UsersInMeetingsGetPayload<typeof usersWithMeetings>

const userWithMeeting = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: { meeting: true },
})

type UserWithMeeting = Prisma.UserGetPayload<typeof userWithMeeting>

const userWithProfile = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    userDetail: true,
    socialMedia: true,
  },
})

type UserWithProfile = Prisma.UserGetPayload<typeof userWithProfile>

export { prisma, UsersWithMeetings, UserWithMeeting, UserWithProfile }
