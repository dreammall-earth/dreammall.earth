import { prisma } from '#src/prisma'

export const deleteAll = async () => {
  await prisma.contactForm.deleteMany()
  await prisma.$executeRaw`DELETE FROM NewsletterPreOptIn`
  await prisma.$executeRaw`DELETE FROM NewsletterSubscription`
  await prisma.event.deleteMany()
  await prisma.usersInMeetings.deleteMany()
  await prisma.user.deleteMany()
  await prisma.meeting.deleteMany()
}

export const disconnect = async () => {
  await prisma.$disconnect()
}
