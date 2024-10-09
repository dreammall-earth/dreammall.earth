import type { PrismaClient } from '#src/prisma'

export const deleteTable =
  ({ prisma }: { prisma: PrismaClient }) =>
  (tableId: number) => {
    return prisma.meeting.deleteMany({ where: { id: tableId } })
  }
