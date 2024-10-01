import type Logger from '#src/logger'
import type { PrismaClient } from '#src/prisma'

export const deleteTable =
  ({ prisma, logger }: { prisma: PrismaClient; logger: typeof Logger }) =>
  async ({ userId, tableId }: { userId: number; tableId: number }) => {
    const meeting = await prisma.meeting.findFirst({
      where: {
        id: tableId,
        users: {
          some: {
            userId,
          },
        },
      },
      include: {
        users: true,
      },
    })
    if (!meeting) {
      throw new Error('Meeting not found!')
    }
    try {
      await prisma.usersInMeetings.delete({
        where: {
          meetingId_userId: {
            userId,
            meetingId: tableId,
          },
        },
      })
      if (!meeting.users.some((u) => u.userId !== userId && u.role === 'MODERATOR')) {
        await prisma.meeting.delete({
          where: {
            id: tableId,
          },
        })
      }
    } catch (e) {
      logger.error('User could not be detached', e)
      throw new Error('User could not be detached.')
    }
  }
