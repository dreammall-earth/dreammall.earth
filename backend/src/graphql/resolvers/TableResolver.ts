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
import { CreateMeetingResponse } from '#api/BBB/types'
import { CONFIG } from '#config/config'
import { OpenTable, Table } from '#models/TableModel'
import { Context } from '#src/context'
import { EVENT_CREATE_MY_TABLE, EVENT_UPDATE_MY_TABLE, EVENT_CREATE_TABLE } from '#src/event/Events'
import logger from '#src/logger'
import { prisma, UserWithMeeting, UsersWithMeetings } from '#src/prisma'

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

    const oldMeetindID = user.meetingId

    const meetingID: string = await createMeetingID()

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

    if (userIds && userIds.length) {
      await createUsersInMeetings({ userIds, meeting, role: AttendeeRole.VIEWER })
    }
    const usersInMeetings = await findUsersInMeetings(meeting)

    await EVENT_CREATE_MY_TABLE(user.id)

    if (oldMeetindID) {
      await prisma.usersInMeetings.deleteMany({
        where: {
          meetingId: oldMeetindID,
        },
      })

      await prisma.meeting.delete({
        where: {
          id: oldMeetindID,
        },
      })
    }
    const usersInMeetings = await findUsersInMeetings(meeting)

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

    if (userIds && userIds.length) {
      await prisma.usersInMeetings.createMany({
        data: userIds.map((id) => ({
          role: AttendeeRole.VIEWER,
          meetingId: meeting.id,
          userId: id,
        })),
      })
    }
    const usersInMeetings = await findUsersInMeetings(meeting)

    await EVENT_UPDATE_MY_TABLE(user.id)

    return new Table(meeting, usersInMeetings)
  }

  @Authorized()
  @Mutation(() => Int)
  async joinMyTable(@Ctx() context: Context): Promise<number> {
    const { user } = context
    if (!user) throw new Error('User not found!')

    if (!user.meetingId) {
      throw new Error('No meeting for user!')
    }

    const dbMeeting = await prisma.meeting.findUnique({
      where: {
        id: user.meetingId,
      },
    })

    if (!dbMeeting) throw new Error('Meeting not found!')

    const inviteLink = createInviteLink(dbMeeting.id)

    await createBBBMeeting({
      meetingID: dbMeeting.meetingID,
      name: dbMeeting.name,
      inviteLink,
      tableId: dbMeeting.id,
    })

    return dbMeeting.id
  }

  @Authorized()
  @Query(() => [OpenTable])
  async openTables(): Promise<OpenTable[]> {
    const meetings = await getMeetings()
    return openTablesFromOpenMeetings(meetings)
  }

  @Authorized()
  @Mutation(() => Table)
  async createTable(
    // params: CreateGroupTableParams,
    @Arg('name') name: string,
    @Arg('isPublic') isPublic: boolean,
    @Ctx() context: Context,
    // eslint-disable-next-line type-graphql/wrong-decorator-signature
    @Arg('userIds', () => [Int], { nullable: 'itemsAndList' }) // eslint-disable-next-line type-graphql/invalid-nullable-input-type
    userIds?: number[] | null | undefined,
  ): Promise<Table> {
    const { user } = context
    if (!user) throw new Error('User not found!')

    // Get Meeting where user.id and userIds are Moderator
    // Check if GroupMeeting already exist how to recognize the Meeting?
    // if (user.meetingId) {
    //   throw new Error('Meeting already exists!')
    // }

    const meetingID: string = await createMeetingID()

    const dbMeeting = await prisma.meeting.create({
      data: { meetingID, name, public: isPublic },
    })

    if (!userIds) {
      userIds = []
    }

    if (!userIds.some((userId) => userId === user.id)) {
      userIds.push(user.id)
    }

    if (userIds.length) {
      await createUsersInMeetings({ userIds, meeting: dbMeeting })
    }
    const usersInMeetings = await findUsersInMeetings(dbMeeting)

    await EVENT_CREATE_TABLE(user.id)

    return new Table(dbMeeting, usersInMeetings)
  }

  @Authorized()
  @Query(() => String)
  async joinTable(
    @Arg('tableId', () => Int) tableId: number,
    @Ctx() context: Context,
  ): Promise<string> {
    const { user } = context

    if (!user) throw new Error('User not found!')

    const table = await prisma.meeting.findUnique({
      where: {
        id: tableId,
      },
      include: {
        user: true,
        users: true,
      },
    })

    if (!table) {
      throw new Error('Table does not exist')
    }

    let password: string

    if (
      (table.user && table.user.id === user.id) ||
      table.users.some((e) => e.userId === user.id && e.role === 'MODERATOR')
    ) {
      const inviteLink = createInviteLink(table.id)
      const meeting = await createBBBMeeting({
        meetingID: table.meetingID,
        name: table.name,
        inviteLink,
        tableId: table.id,
      })
      password = meeting.moderatorPW
    } else if (table.public || table.users.some((u) => u.userId === user.id)) {
      if (!table.attendeePW) {
        throw new Error('This meeting does not exists.')
      }
      password = table.attendeePW
    } else {
      throw new Error('User has no access to meeting.')
    }

    return joinMeetingLink({
      fullName: user.name,
      meetingID: table.meetingID,
      password,
    })
  }

  @Query(() => String)
  async joinTableAsGuest(
    @Arg('userName') userName: string,
    @Arg('tableId', () => Int) tableId: number,
  ): Promise<string> {
    const meeting = await prisma.meeting.findUnique({
      where: {
        id: tableId,
      },
      include: {
        user: true,
      },
    })
    if (!meeting) throw new Error('Table does not exist')

    return joinMeetingLink({
      fullName: userName,
      meetingID: meeting.meetingID,
      password: meeting.attendeePW ? meeting.attendeePW : '',
    })
  }

  @Authorized()
  @Query(() => [Table])
  async tables(@Ctx() context: Context): Promise<Table[]> {
    const { user } = context
    const dbMeetings = await prisma.meeting.findMany({
      where: {
        OR: [
          {
            user: {
              id: user?.id,
            },
          },
          {
            users: {
              some: {
                userId: user?.id,
                role: AttendeeRole.MODERATOR,
              },
            },
          },
        ],
      },
      include: {
        users: true,
      },
    })
    const tables: Table[] = []
    for (const meeting of dbMeetings) {
      const usersInMeetings = await findUsersInMeetings(meeting)
      tables.push(new Table(meeting, usersInMeetings))
    }
    return tables
  }

  @Subscription(() => [OpenTable], {
    topics: 'OPEN_TABLE_SUBSCRIPTION',
  })
  async updateOpenTables(
    @Root() meetings: MeetingInfo[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Arg('username') username: string,
  ): Promise<OpenTable[]> {
    return openTablesFromOpenMeetings(meetings)
  }

  /*
  @Query(() => Boolean)
  test(): boolean {
    try {
      pubSub.publish('OPEN_TABLE_SUBSCRIPTION', 'Hallo')
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

const createUsersInMeetings = async (data: {
  userIds: number[]
  meeting: Meeting
  role?: AttendeeRole
}) => {
  await prisma.usersInMeetings.createMany({
    data: data.userIds.map((id) => ({
      role: data.role,
      meetingId: data.meeting.id,
      userId: id,
    })),
  })
}

const findUsersInMeetings = async (meeting: Meeting): Promise<UsersWithMeetings[]> => {
  return (await prisma.usersInMeetings.findMany({
    where: {
      meetingId: meeting.id,
    },
    include: {
      user: true,
    },
  })) as UsersWithMeetings[]
}

const createMeetingID = async (): Promise<string> => {
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

function createInviteLink(tableId: number) {
  return new URL(`join-table/${tableId}`, CONFIG.FRONTEND_URL).toString()
}

async function createBBBMeeting(data: {
  meetingID: string
  name: string
  inviteLink: string
  tableId: number
}): Promise<CreateMeetingResponse> {
  const meeting = await createMeeting(
    {
      meetingID: data.meetingID,
      name: data.name,
    },
    {
      moderatorOnlyMessage: `Use this link to invite more people:<br/>${data.inviteLink}`,
    },
  )
  if (!meeting) {
    throw new Error('Error creating the meeting!')
  }
  try {
    await prisma.meeting.update({
      where: { id: data.tableId },
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
  return meeting
}
