import { prisma } from '#src/prisma'

export const deleteAll = async () => {
  await prisma.contactForm.deleteMany()
  await prisma.newsletterSubscription.deleteMany()
}

export const disconnect = async () => {
  await prisma.$disconnect()
}
