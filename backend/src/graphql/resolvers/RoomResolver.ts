import { Meeting } from '@prisma/client'
import {
  ObjectType,
  Field,
  Int,
  Resolver,
  Mutation,
  Query,
  Authorized,
  Ctx,
  Arg,
} from 'type-graphql'
// eslint-disable-next-line import/named
import { v4 as uuidv4 } from 'uuid'

// import { createMeeting, getMeetings } from '#api/BBB'
import { CONFIG } from '#config/config'
import { prisma } from '#src/prisma'
import { Context } from '#src/server/context'

@ObjectType()
class Room {
  constructor(meeting: Meeting) {
    this.id = meeting.id
    this.name = meeting.name
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => Int)
  id: number

  @Field()
  name: string
}

@Resolver()
export class RoomResolver {
  @Authorized()
  @Query(() => String)
  // eslint-disable-next-line @typescript-eslint/require-await
  async getRoom(): Promise<string> {
    return CONFIG.ROOM_LINK
  }

  @Authorized()
  @Mutation(() => Room, { nullable: true })
  async createMyRoom(@Arg('name') name: string, @Ctx() context: Context): Promise<Room | null> {
    const { user } = context
    if (!user) return null
    if (user.meetingId) {
      const meeting = await prisma.meeting.findUnique({
        where: {
          id: user.meetingId,
        },
      })
      if (meeting) return new Room(meeting)
      else return null
    }

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

    const meeting = await prisma.meeting.create({
      data: {
        name,
        meetingID,
      },
    })

    await prisma.user.update({
      where: { id: user.id },
      data: { meetingId: meeting.id },
    })
    return meeting
  }

  /*
  @Query(() => Boolean)
  async test(): Promise<boolean> {
    try {
      const result = await createMeeting({
        name: 'My Meeting ßß',
        meetingID: 'xxx',
      })
      const result2 = await createMeeting({
        name: 'My Meeting xx',
        meetingID: 'xxz',
      })
      // console.log(result)
      const test = await getMeetings()
    } catch (err) {
      console.log(err)
      return false
    }
    return true
  }
  */
}
