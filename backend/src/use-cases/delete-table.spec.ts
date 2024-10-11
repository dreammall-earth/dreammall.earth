import { prisma } from '#src/prisma'

import { deleteTable } from './delete-table'

describe('deleteTable', () => {
  const setup = async () => {
    await Promise.all([
      prisma.meeting.create({
        data: {
          id: 47,
          name: 'Some meeting',
          meetingID: 'some-meeting-id',
        },
      }),
      prisma.user.create({
        data: {
          referenceId: 'ABCDEFGHI',
          username: 'username',
          name: 'User Name',
          pk: 5,
          id: 43,
        },
      }),
    ])
    await prisma.usersInMeetings.create({
      data: {
        meetingId: 47,
        userId: 43,
      },
    })
  }

  it('removes a table along with all join models (cascade)', async () => {
    await setup()
    await expect(prisma.meeting.count()).resolves.toBe(1)
    await expect(prisma.usersInMeetings.count()).resolves.toBe(1)

    await deleteTable({ prisma })(47)

    await expect(prisma.meeting.count()).resolves.toBe(0)
    await expect(prisma.usersInMeetings.count()).resolves.toBe(0)
  })
})
