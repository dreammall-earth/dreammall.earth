import { Prisma, Meeting } from '@prisma/client'
import { InternalArgs } from '@prisma/client/runtime/library'
// eslint-disable-next-line import/named
import { v4 as uuidv4 } from 'uuid'

import { prisma } from '#src/prisma'

export class MeetingRepository {
  public async findUnique(
    data: Prisma.MeetingFindUniqueArgs<
      InternalArgs & {
        result: object
        model: object
        query: object
        client: object
      }
    >,
  ): Promise<Meeting | null> {
    return prisma.meeting.findUnique(data)
  }

  public async create(data: Prisma.MeetingCreateArgs<InternalArgs>): Promise<Meeting> {
    return prisma.meeting.create(data)
  }

  public async update(data: Prisma.MeetingUpdateArgs<InternalArgs>): Promise<Meeting> {
    return prisma.meeting.update(data)
  }

  public async generateMeetingID() {
    let meetingID: string = uuidv4()
    while (
      await prisma.meeting.count({
        where: {
          meetingID,
        },
      })
    ) {
      meetingID = uuidv4()
    }
    return meetingID
  }
}

const meetingRepository: MeetingRepository = new MeetingRepository()

export default meetingRepository
