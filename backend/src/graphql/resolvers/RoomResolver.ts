import { Meeting } from '@prisma/client'
import {
  Resolver,
  Mutation,
  Query,
  Authorized,
  Ctx,
  Arg,
  Int,
  Subscription,
  Root,
} from 'type-graphql'
// eslint-disable-next-line import/named
import { v4 as uuidv4 } from 'uuid'

import { createMeeting, joinMeetingLink, getMeetings, MeetingInfo } from '#api/BBB'
import { CONFIG } from '#config/config'
import { Room, OpenRoom } from '#models/RoomModel'
import { pubSub } from '#src/graphql/pubSub'
import logger from '#src/logger'
import { prisma } from '#src/prisma'
import { Context } from '#src/server/context'

@Resolver()
export class RoomResolver {
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

  @Authorized()
  @Mutation(() => String)
  async joinMyRoom(@Ctx() context: Context): Promise<string> {
    const { user } = context
    if (!user) throw new Error('User not found!')

    let dbMeeting: Meeting | null = null

    try {
      if (user.meetingId) {
        dbMeeting = await prisma.meeting.findUnique({
          where: {
            id: user.meetingId,
          },
        })
        if (!dbMeeting) throw new Error('Meeting not found!')
      } else {
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

        dbMeeting = await prisma.meeting.create({
          data: {
            name: user.username,
            meetingID,
          },
        })
        await prisma.user.update({
          where: { id: user.id },
          data: { meetingId: dbMeeting.id },
        })
      }
    } catch (err) {
      logger.error('Could not create Meeting in DB!', err)
      throw new Error('Could not create Meeting in DB!')
    }

    const inviteLink = CONFIG.FRONTEND_INVITE_LINK_URL + dbMeeting.id

    const meeting = await createMeeting(
      {
        name: dbMeeting.name,
        meetingID: dbMeeting.meetingID,
      },
      {
        moderatorOnlyMessage: `Use this link to invite more people:<br/>${inviteLink}`,
      },
    )

    if (!meeting) throw new Error('Could not create meeting!')

    try {
      await prisma.meeting.update({
        where: { id: dbMeeting.id },
        data: {
          attendeePW: meeting.attendeePW,
          moderatorPW: meeting.moderatorPW,
          voiceBridge: meeting.voiceBridge,
          dialNumber: meeting.dialNumber,
          createTime: meeting.createTime,
          createDate: new Date(meeting.createDate).toISOString(),
        },
      })
    } catch (err) {
      logger.error('Could not update Meeting in DB!', err)
      throw new Error('Could not update Meeting in DB!')
    }

    return joinMeetingLink({
      fullName: user.name,
      meetingID: meeting.meetingID,
      password: meeting.moderatorPW,
      role: 'MODERATOR',
      createTime: meeting.createTime.toString(),
      userID: user.id.toString(),
    })
  }

  @Authorized()
  @Query(() => [OpenRoom])
  async openRooms(@Ctx() context: Context): Promise<OpenRoom[]> {
    const { user } = context
    if (!user) return []
    const meetings = await getMeetings()

    if (meetings.length) {
      const dbMeetingsPwMap = await prisma.meeting.findMany({
        where: {
          meetingID: { in: meetings.map((m: MeetingInfo) => m.meetingID) },
        },
        select: {
          meetingID: true,
          attendeePW: true,
        },
      })

      return meetings.map((m: MeetingInfo) => {
        const pw = dbMeetingsPwMap.find((pw) => pw.meetingID === m.meetingID)
        return new OpenRoom(
          m,
          joinMeetingLink({
            fullName: user.name,

            meetingID: m.meetingID,
            password: pw?.attendeePW ? pw.attendeePW : '',
          }),
        )
      })
    }
    return []
  }

  @Query(() => String)
  async joinRoom(
    @Arg('userName') userName: string,
    @Arg('roomId', () => Int) roomId: number,
  ): Promise<string> {
    const meeting = await prisma.meeting.findUnique({
      where: {
        id: roomId,
      },
    })
    if (!meeting) throw new Error('Room does not exist')
    return joinMeetingLink({
      fullName: userName,
      meetingID: meeting.meetingID,
      password: meeting.attendeePW ? meeting.attendeePW : '',
    })
  }

  @Subscription({
    topics: 'OPEN_ROOM_SUBSCRIPTION',
  })
  updateOpenRooms(@Root() openMeetings: string): string {
    return openMeetings
  }

  @Query(() => Boolean)
  test(): boolean {
    pubSub.publish('OPEN_ROOM_SUBSCRIPTION', 'Hallo')
    return true
  }
}
