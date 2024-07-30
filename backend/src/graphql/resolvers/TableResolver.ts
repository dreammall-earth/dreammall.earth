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

import { createMeeting, joinMeetingLink, getMeetings, MeetingInfo, AttendeeRole } from '#api/BBB'
import { CONFIG } from '#config/config'
import { OpenTable, Table } from '#models/TableModel'
import logger from '#src/logger'
import { prisma, UserWithMeeting, UsersWithMeetings } from '#src/prisma'
import { Context } from '#src/server/context'

@Resolver()
export class TableResolver {
  @Authorized()
  @Mutation(() => Table)
  async createMyTable(
    @Arg('name') name: string,
    @Arg('isPublic') isPublic: boolean,
    @Ctx() context: Context,
    // eslint-disable-next-line type-graphql/wrong-decorator-signature
    @Arg('userIds', () => [Int], { nullable: 'itemsAndList' }) // eslint-disable-next-line type-graphql/invalid-nullable-input-type
    userIds?: number[] | null | undefined,
  ): Promise<Table> {
    const { user } = context
    if (!user) throw new Error('User not found!')

    if (user.meetingId) {
      throw new Error('Meeting already exists!')
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

    const { meeting } = (await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        meeting: {
          create: {
            name,
            meetingID,
            public: isPublic,
          },
        },
      },
      include: {
        meeting: true,
      },
    })) as UserWithMeeting

    if (!meeting) {
      throw new Error('Error creating the meeting!')
    }

    let usersInMeetings: UsersWithMeetings[] = []

    if (userIds && userIds.length) {
      await prisma.usersInMeetings.createMany({
        data: userIds.map((id) => ({
          role: AttendeeRole.VIEWER,
          meetingId: meeting.id,
          userId: id,
        })),
      })

      usersInMeetings = (await prisma.usersInMeetings.findMany({
        where: {
          meetingId: meeting.id,
        },
        include: {
          user: true,
        },
      })) as UsersWithMeetings[]
    }

    return new Table(meeting, usersInMeetings)
  }

  @Authorized()
  @Mutation(() => Table)
  async updateMyTable(
    @Arg('name') name: string,
    @Arg('isPublic') isPublic: boolean,
    @Ctx() context: Context,
    // eslint-disable-next-line type-graphql/wrong-decorator-signature
    @Arg('userIds', () => [Int], { nullable: 'itemsAndList' }) // eslint-disable-next-line type-graphql/invalid-nullable-input-type
    userIds?: number[] | null | undefined,
  ): Promise<Table> {
    const { user } = context
    if (!user) throw new Error('User not found!')

    if (!user.meetingId) {
      throw new Error('User has no meeting!')
    }

    const meeting = await prisma.meeting.update({
      where: {
        id: user.meetingId,
      },
      data: {
        name,
        public: isPublic,
      },
    })

    if (!meeting) {
      throw new Error('Error updating the meeting!')
    }

    await prisma.usersInMeetings.deleteMany({
      where: {
        meetingId: meeting.id,
      },
    })

    let usersInMeetings: UsersWithMeetings[] = []

    if (userIds && userIds.length) {
      await prisma.usersInMeetings.createMany({
        data: userIds.map((id) => ({
          role: AttendeeRole.VIEWER,
          meetingId: meeting.id,
          userId: id,
        })),
      })

      usersInMeetings = (await prisma.usersInMeetings.findMany({
        where: {
          meetingId: meeting.id,
        },
        include: {
          user: true,
        },
      })) as UsersWithMeetings[]
    }

    return new Table(meeting, usersInMeetings)
  }

  @Authorized()
  @Mutation(() => String)
  async joinMyTable(@Ctx() context: Context): Promise<string> {
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
      role: AttendeeRole.MODERATOR,
      createTime: meeting.createTime.toString(),
      userID: user.id.toString(),
    })
  }

  @Authorized()
  @Query(() => [OpenTable])
  async openTables(@Ctx() context: Context): Promise<OpenTable[]> {
    const { user } = context
    if (!user) return []
    const meetings = await getMeetings()

    return openTablesFromOpenMeetings(meetings, user.name)
  }

  @Query(() => String)
  async joinTable(
    @Arg('userName') userName: string,
    @Arg('tableId', () => Int) tableId: number,
  ): Promise<string> {
    const meeting = await prisma.meeting.findUnique({
      where: {
        id: tableId,
      },
    })
    if (!meeting) throw new Error('Table does not exist')
    return joinMeetingLink({
      fullName: userName,
      meetingID: meeting.meetingID,
      password: meeting.attendeePW ? meeting.attendeePW : '',
    })
  }

  @Subscription(() => [OpenTable], {
    topics: 'OPEN_ROOM_SUBSCRIPTION',
  })
  async updateOpenTables(
    @Root() meetings: MeetingInfo[],
    @Arg('username') username: string,
  ): Promise<OpenTable[]> {
    return openTablesFromOpenMeetings(meetings, username)
  }

  /*
  @Query(() => Boolean)
  test(): boolean {
    try {
      pubSub.publish('OPEN_ROOM_SUBSCRIPTION', 'Hallo')
    } catch (err) {
      console.log(err)
    }
    return true
  }
  */
}

const openTablesFromOpenMeetings = async (
  meetings: MeetingInfo[],
  username: string,
): Promise<OpenTable[]> => {
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
      return new OpenTable(
        m,
        joinMeetingLink({
          fullName: username,

          meetingID: m.meetingID,
          password: pw?.attendeePW ? pw.attendeePW : '',
        }),
      )
    })
  }

  return []
}
