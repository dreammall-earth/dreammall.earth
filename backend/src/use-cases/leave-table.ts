import { deleteTable } from './delete-table'

import type { Logger } from '#src/logger'
import type { PrismaClient } from '#src/prisma'

const oneElseIsModerator = (userId: number) => (user: { userId: number; role: string }) => {
  return user.userId !== userId && user.role === 'MODERATOR'
}

export const leaveTable =
  ({ prisma, logger }: { prisma: PrismaClient; logger: Logger }) =>
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
      if (!meeting.users.some(oneElseIsModerator(userId))) {
        await deleteTable({ prisma })(tableId)
      }
    } catch (e) {
      logger.error('User could not be detached', e)
      throw new Error('User could not be detached.')
    }
  }
