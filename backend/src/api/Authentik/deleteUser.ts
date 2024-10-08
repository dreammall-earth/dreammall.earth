import { leaveTable } from '#src/use-cases/leave-table'

import type { Dependencies } from '.'
import type { Request } from 'express'

type ModelDeleteUserBodyPayload = {
  model: {
    pk: number
    app: string
    name: string
    model_name: string
  }
  http_request: {
    args: Request<string, unknown>
    path: string
    method: string
    request_id: string
    user_agent: string
  }
}

const isEvent = (body: string): ModelDeleteUserBodyPayload | undefined => {
  const [eventType, ...rest] = body.split(': ')
  if (eventType !== 'model_deleted') return
  const payload = JSON.parse(rest.join(': ').replaceAll("'", '"')) as ModelDeleteUserBodyPayload
  if (payload.model.model_name !== 'user') return
  return payload
}

const handleEvent =
  ({ prisma, logger }: Dependencies) =>
  async (authentikPayload: ModelDeleteUserBodyPayload) => {
    logger.debug('payload', authentikPayload)
    const {
      model: { pk },
    } = authentikPayload

    const deletedUser = await prisma.user.findFirst({
      where: { pk },
      include: {
        meetings: true,
      },
    })

    if (!deletedUser) {
      return
    }

    const { id: userId, meetingId } = deletedUser

    const renameMeetingIdToTableId = (meeting: { userId: number; meetingId: number }) => ({
      userId: meeting.userId,
      tableId: meeting.meetingId,
    })
    await Promise.all(
      deletedUser.meetings.map(renameMeetingIdToTableId).map(leaveTable({ prisma, logger })),
    )

    if (meetingId) {
      await prisma.meeting.deleteMany({ where: { id: meetingId } })
    }

    await prisma.userDetail.deleteMany({ where: { userId } })
    await prisma.socialMedia.deleteMany({ where: { userId } })
    await prisma.user.deleteMany({ where: { pk } })

    // TODO: why prisma.$transaction doesn't work here ?
    // await prisma.$transaction([prisma.user.deleteMany({ where: { id: userId } })])
  }

export const deleteUser = { isEvent, handleEvent }
