import type { Context } from '#src/context'

type Dependencies = {
  config: Context['config']
  prisma: Context['dataSources']['prisma']
}

export const onStartup = async ({ config, prisma }: Dependencies) => {
  const { WELCOME_TABLE_MEETING_ID, WELCOME_TABLE_NAME } = config
  const welcomeTable = await prisma.meeting.findFirst({
    where: {
      meetingID: WELCOME_TABLE_MEETING_ID,
    },
  })
  if (welcomeTable) {
    await prisma.meeting.update({
      where: {
        meetingID: WELCOME_TABLE_MEETING_ID,
      },
      data: {
        ...welcomeTable,
        name: WELCOME_TABLE_NAME,
      },
    })
    return
  }
  await prisma.meeting.create({
    data: {
      public: true,
      meetingID: WELCOME_TABLE_MEETING_ID,
      name: WELCOME_TABLE_NAME,
      type: 'PERMANENT',
    },
  })
}
