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

import { createMeeting, joinMeetingLink, getMeetings, MeetingInfo, AttendeeRole } from '#api/BBB'
import { CONFIG } from '#config/config'
import { OpenTable, Table } from '#models/TableModel'
import { Context } from '#src/context'
import { EVENT_CREATE_MY_TABLE, EVENT_UPDATE_MY_TABLE } from '#src/event/Events'
import logger from '#src/logger'
import { prisma, UsersWithMeetings, UserWithMeeting } from '#src/prisma'
import meetingRepository from '#src/Repositories/MeetingRepository'
import userRepository from '#src/Repositories/UserRepository'

export interface ApiRequestParams {
  context: Context
}

export interface CreateGroupTableParams extends ApiRequestParams {
  name: string
  isPublic: boolean
  userIds?: number[] | null | undefined
}

@Resolver()
export class TableResolver {
  // private userRepository = new UserRepository()

  // @Authorized()
  // @Mutation(() => Table)
  // async createGroupTable(
  //   // params: CreateGroupTableParams,
  //   @Arg('name') name: string,
  //   @Arg('isPublic') isPublic: boolean,
  //   @Ctx() context: Context,
  //   // eslint-disable-next-line type-graphql/wrong-decorator-signature
  //   @Arg('userIds', () => [Int], { nullable: 'itemsAndList' }) // eslint-disable-next-line type-graphql/invalid-nullable-input-type
  //   userIds?: number[] | null | undefined,
  // ): Promise<Table> {
  //   const { user } = context
  //   if (!user) throw new Error('User not found!')

  //   // Check if GroupMeeting already exist how to recognize the Meeting
  //   // if (user.meetingId) {
  //   //   throw new Error('Meeting already exists!')
  //   // }

  //   const meetingID: string = await meetingRepository.generateMeetingID()

  //   await EVENT_CREATE_GROUP_TABLE(user.id)

  //   return new Table(meeting, usersInMeetings)
  // }

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

    const meetingID: string = await meetingRepository.generateMeetingID()

    const { meeting } = (await userRepository.update({
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

    await EVENT_CREATE_MY_TABLE(user.id)

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

    const meeting = await meetingRepository.update({
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

    await EVENT_UPDATE_MY_TABLE(user.id)

    return new Table(meeting, usersInMeetings)
  }

  @Authorized()
  @Mutation(() => Int)
  async joinMyTable(@Ctx() context: Context): Promise<number> {
    const { user } = context
    if (!user) throw new Error('User not found!')

    let dbMeeting: Meeting | null = null

    try {
      if (user.meetingId) {
        dbMeeting = await meetingRepository.findUnique({
          where: {
            id: user.meetingId,
          },
        })
        // prisma.meeting.findUnique({
        //   where: {
        //     id: user.meetingId,
        //   },
        // })
        if (!dbMeeting) throw new Error('Meeting not found!')
      } else {
        const meetingID: string = await meetingRepository.generateMeetingID()

        dbMeeting = await meetingRepository.create({
          data: {
            name: user.username,
            meetingID,
          },
        })
        if (!dbMeeting) throw new Error()
        // prisma.meeting.create({
        //   data: {
        //     name: user.username,
        //     meetingID,
        //   },
        // })
        await userRepository.update({
          where: { id: user.id },
          data: { meetingId: dbMeeting.id },
        })
        // await prisma.user.update({
        //   where: { id: user.id },
        //   data: { meetingId: dbMeeting.id },
        // })
      }
    } catch (err) {
      logger.error('Could not create Meeting in DB!', err)
      throw new Error('Could not create Meeting in DB!')
    }

    const inviteLink = new URL(`join-table/${dbMeeting.id}`, CONFIG.FRONTEND_URL).toString()

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
      await meetingRepository.update({
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

    return dbMeeting.id
  }

  @Authorized()
  @Query(() => [OpenTable])
  async openTables(): Promise<OpenTable[]> {
    const meetings = await getMeetings()
    return openTablesFromOpenMeetings(meetings)
  }

  @Authorized()
  @Query(() => String)
  async joinTable(
    @Arg('tableId', () => Int) tableId: number,
    @Ctx() context: Context,
  ): Promise<string> {
    const { user } = context
    if (!user) throw new Error('User not found!')

    const meeting = await prisma.meeting.findUnique({
      where: {
        id: tableId,
      },
      include: {
        user: true,
      },
    })
    if (!meeting) throw new Error('Table does not exist')

    let password: string

    if (meeting.user && meeting.user.id === user.id) {
      password = meeting.moderatorPW ? meeting.moderatorPW : ''
    } else {
      password = meeting.attendeePW ? meeting.attendeePW : ''
    }

    return joinMeetingLink({
      fullName: user.name,
      meetingID: meeting.meetingID,
      password,
    })
  }

  @Query(() => String)
  async joinTableAsGuest(
    @Arg('userName') userName: string,
    @Arg('tableId', () => Int) tableId: number,
  ): Promise<string> {
    const meeting = await meetingRepository.findUnique({
      where: {
        id: tableId,
      },
      include: {
        user: true,
      },
    })
    if (!meeting) throw new Error('Table does not exist')

    const password = meeting.attendeePW ? meeting.attendeePW : ''
    return joinMeetingLink({
      fullName: userName,
      meetingID: meeting.meetingID,
      password,
    })
  }

  @Subscription(() => [OpenTable], {
    topics: 'OPEN_ROOM_SUBSCRIPTION',
  })
  async updateOpenTables(
    @Root() meetings: MeetingInfo[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Arg('username') username: string,
  ): Promise<OpenTable[]> {
    // console.log('--------------------', username)
    return openTablesFromOpenMeetings(meetings)
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

const openTablesFromOpenMeetings = async (meetings: MeetingInfo[]): Promise<OpenTable[]> => {
  if (meetings.length) {
    const dbMeetings = await prisma.meeting.findMany({
      where: {
        meetingID: { in: meetings.map((m: MeetingInfo) => m.meetingID) },
      },
      select: {
        id: true,
        meetingID: true,
      },
    })

    const openTables: OpenTable[] = []

    dbMeetings.forEach((ids) => {
      const meeting = meetings.find((m) => ids.meetingID === m.meetingID)
      if (meeting) openTables.push(new OpenTable(meeting, ids.id ? ids.id : 0))
    })
    return openTables
  }

  return []
}
