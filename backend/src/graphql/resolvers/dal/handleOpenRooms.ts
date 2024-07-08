import { getMeetings, MeetingInfo } from '#api/BBB'
import { prisma } from '#src/prisma'

export const handleOpenRooms = async (): Promise<void> => {
  const meetings = await getMeetings()
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

export const checkForOpenRooms = (): void => {
  void handleOpenRooms()
  setTimeout(checkForOpenRooms, 60 * 1000)
}
