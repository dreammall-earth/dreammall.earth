import { prisma } from '#src/prisma'

export const deleteAll = async () => {
  await prisma.hello.deleteMany()
}

export const disconnect = async () => {
  prisma.$disconnect()
}
