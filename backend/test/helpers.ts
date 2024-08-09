import { findOrCreateUser } from '#src/context/findOrCreateUser'
import { prisma } from '#src/prisma'

import type { Context } from '#src/context/context'

export const deleteAll = async () => {
  await prisma.contactForm.deleteMany()
  await prisma.$executeRaw`DELETE FROM NewsletterPreOptIn`
  await prisma.$executeRaw`DELETE FROM NewsletterSubscription`
  await prisma.event.deleteMany()
  await prisma.usersInMeetings.deleteMany()
  await prisma.userDetail.deleteMany()
  await prisma.socialMedia.deleteMany()
  await prisma.user.deleteMany()
  await prisma.meeting.deleteMany()
}

export const disconnect = async () => {
  await prisma.$disconnect()
}

export const authenticatedUser = async (
  payload: Parameters<typeof findOrCreateUser>[0],
): Promise<NonNullable<Context['user']>> => {
  const dbUser = await findOrCreateUser(payload)
  return { ...dbUser, roles: [] }
}
