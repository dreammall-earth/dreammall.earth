import { getMeetings, MeetingInfo } from '#api/BBB'
import { pubSub } from '#src/graphql/pubSub'
import { prisma } from '#src/prisma'

export const handleOpenTables = async (): Promise<void> => {
  const meetings = await getMeetings()
  pubSub.publish('OPEN_ROOM_SUBSCRIPTION', meetings)
  await prisma.meeting.updateMany({
    where: {
      createTime: { not: null },
      meetingID: {
        not: {
          in: meetings.map((m: MeetingInfo) => m.meetingID),
        },
      },
    },
    data: {
      attendeePW: null,
      moderatorPW: null,
      voiceBridge: null,
      dialNumber: null,
      createTime: null,
      createDate: null,
    },
  })
}

export const checkForOpenTables = (): void => {
  void handleOpenTables()
  setTimeout(checkForOpenTables, 10 * 1000)
}
