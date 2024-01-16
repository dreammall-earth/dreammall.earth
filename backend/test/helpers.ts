import { prisma } from '#src/prisma'

export const deleteAll = async () => {
  await prisma.contactForm.deleteMany()
  await prisma.$executeRaw`DELETE FROM NewsletterPreOptIn`
  await prisma.$executeRaw`DELETE FROM NewsletterSubscription`
}

export const disconnect = async () => {
  await prisma.$disconnect()
}
