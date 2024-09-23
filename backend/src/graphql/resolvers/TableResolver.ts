import { Meeting, User } from '@prisma/client'
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
import { CreateMeetingResponse, AttendeeInfo } from '#api/BBB/types'
import { CONFIG } from '#config/config'
import { Attendee } from '#models/AttendeeModel'
import { OpenTable, Table } from '#models/TableModel'
import { Context } from '#src/context'
import {
  EVENT_CREATE_MY_TABLE,
  EVENT_UPDATE_MY_TABLE,
  EVENT_CREATE_TABLE,
  EVENT_UPDATE_TABLE,
} from '#src/event/Events'
import logger from '#src/logger'

import type { PrismaClient, UserWithMeeting, UsersWithMeetings } from '#src/prisma'

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
    const {
      user,
      dataSources: { prisma },
    } = context
    if (!user) throw new Error('User not found!')

    const oldMeetindID = user.meetingId

    const meetingID: string = await createMeetingID(prisma)()

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
      await createUsersInMeetings(prisma)({ userIds, meeting, role: AttendeeRole.VIEWER })
    }

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
    const usersInMeetings = await findUsersInMeetings(prisma)(meeting)

    return Table.fromMeeting(meeting, usersInMeetings)
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
    const {
      user,
      dataSources: { prisma },
    } = context
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
    const usersInMeetings = await findUsersInMeetings(prisma)(meeting)

    await EVENT_UPDATE_MY_TABLE(user.id)

    return Table.fromMeeting(meeting, usersInMeetings)
  }

  @Authorized()
  @Mutation(() => Int)
  async joinMyTable(@Ctx() context: Context): Promise<number> {
    const {
      user,
      dataSources: { prisma },
    } = context
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

    await createBBBMeeting(prisma)({
      meetingID: dbMeeting.meetingID,
      name: dbMeeting.name,
      inviteLink,
      tableId: dbMeeting.id,
    })

    return dbMeeting.id
  }

  @Authorized()
  @Query(() => [OpenTable])
  async openTables(@Ctx() context: Context): Promise<OpenTable[]> {
    const {
      dataSources: { prisma },
    } = context
    const user = await prisma.user.findUnique({
      where: {
        id: context.user?.id,
      },
    })
    if (!user) throw new Error('User not found!')
    const meetings = await getMeetings()
    const openWelcomeTable = await getOpenWelcomeTable(context)(meetings)
    const openTables = await openTablesFromOpenMeetings(prisma)({ meetings, user })
    return [openWelcomeTable, ...openTables]
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
    const {
      user,
      dataSources: { prisma },
    } = context
    if (!user) throw new Error('User not found!')

    // Get Meeting where user.id and userIds are Moderator
    // Check if GroupMeeting already exist how to recognize the Meeting?
    // if (user.meetingId) {
    //   throw new Error('Meeting already exists!')
    // }

    const meetingID: string = await createMeetingID(prisma)()

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
      await createUsersInMeetings(prisma)({ userIds, meeting: dbMeeting })
    }
    const usersInMeetings = await findUsersInMeetings(prisma)(dbMeeting)

    await EVENT_CREATE_TABLE(user.id)

    return Table.fromMeeting(dbMeeting, usersInMeetings)
  }

  @Authorized()
  @Query(() => String)
  async joinTable(
    @Arg('tableId', () => Int) tableId: number,
    @Ctx() context: Context,
  ): Promise<string> {
    const {
      user,
      dataSources: { prisma },
    } = context

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
      table.type === 'PERMANENT' ||
      (table.user && table.user.id === user.id) ||
      table.users.some((e) => e.userId === user.id && e.role === 'MODERATOR')
    ) {
      const inviteLink = createInviteLink(table.id)
      const meeting = await createBBBMeeting(prisma)({
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
    @Ctx() context: Context,
  ): Promise<string> {
    const {
      dataSources: { prisma },
    } = context
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

  @Query(() => String)
  async getTableName(
    @Arg('tableId', () => Int) tableId: number,
    @Ctx() context: Context,
  ): Promise<string> {
    const {
      dataSources: { prisma },
    } = context
    const meeting = await prisma.meeting.findUnique({
      where: {
        id: tableId,
      },
    })
    if (!meeting) throw new Error('Table does not exist')

    return meeting.name
  }

  @Authorized()
  @Query(() => [Table])
  async tables(@Ctx() context: Context): Promise<Table[]> {
    const {
      user,
      dataSources: { prisma },
    } = context
    const dbMeetings = await prisma.meeting.findMany({
      where: {
        users: {
          some: {
            userId: user?.id,
            role: AttendeeRole.MODERATOR,
          },
        },
      },
      include: {
        users: true,
      },
    })
    const tables: Table[] = await Promise.all(
      dbMeetings.map(async (meeting) =>
        Table.fromMeeting(meeting, await findUsersInMeetings(prisma)(meeting)),
      ),
    )
    return tables
  }

  @Authorized()
  @Mutation(() => Boolean)
  async deleteTable(
    @Ctx() context: Context,
    @Arg('tableId', () => Int) tableId: number,
  ): Promise<boolean> {
    const {
      user,
      dataSources: { prisma },
    } = context
    if (!user) throw new Error('User not found!')

    const meeting = await prisma.meeting.findFirst({
      where: {
        id: tableId,
        users: {
          some: {
            userId: user?.id,
          },
        },
      },
      include: {
        users: true,
      },
    })
    if (!meeting) {
      throw new Error('Meeting not found!')
    }
    try {
      await prisma.usersInMeetings.delete({
        where: {
          meetingId_userId: {
            userId: user?.id,
            meetingId: tableId,
          },
        },
      })
      if (!meeting.users.some((u) => u.userId !== user?.id && u.role === 'MODERATOR')) {
        await prisma.meeting.delete({
          where: {
            id: tableId,
          },
        })
      }
    } catch (e) {
      logger.error('User could not be detached', e)
      throw new Error('User could not be detached.')
    }

    return true
  }

  @Authorized()
  @Mutation(() => Table)
  async updateTable(
    @Arg('tableId', () => Int) tableId: number,
    @Ctx() context: Context,
    @Arg('name', () => String, { nullable: true }) name: string | null | undefined,
    @Arg('isPublic', { nullable: true }) isPublic: boolean = false,
    // eslint-disable-next-line type-graphql/wrong-decorator-signature
    @Arg('userIds', () => [Int], { nullable: 'itemsAndList' }) // eslint-disable-next-line type-graphql/invalid-nullable-input-type
    userIds?: number[] | null | undefined,
  ): Promise<Table> {
    const {
      user,
      dataSources: { prisma },
    } = context
    if (!user) throw new Error('User not found!')

    let meeting = await prisma.meeting.findFirst({
      where: {
        id: tableId,
      },
      include: {
        users: true,
      },
    })
    if (!meeting) throw new Error('Meeting not found!')
    else if (!meeting.users.some((u) => u.userId === user.id && u.role === 'MODERATOR')) {
      throw new Error('User has no right to edit meeting.')
    }

    if (name) {
      meeting = await prisma.meeting.update({
        where: {
          id: tableId,
        },
        data: {
          name,
          public: isPublic,
        },
        include: {
          users: true,
        },
      })

      if (!meeting) {
        throw new Error('Error updating the meeting!')
      }
    }

    if (userIds && userIds.length) {
      await prisma.usersInMeetings.deleteMany({
        where: {
          meetingId: tableId,
        },
      })
      await prisma.usersInMeetings.createMany({
        data: userIds.map((id) => ({
          meetingId: tableId,
          userId: id,
        })),
      })
    }

    const userInMeeting = await findUsersInMeetings(prisma)(meeting)
    await EVENT_UPDATE_TABLE(user.id)
    return Table.fromMeeting(meeting, userInMeeting)
  }

  @Subscription(() => [OpenTable], {
    topics: 'OPEN_TABLE_SUBSCRIPTION',
  })
  async updateOpenTables(
    @Root() meetings: MeetingInfo[],
    @Arg('username') username: string,
    @Ctx() context: Context,
  ): Promise<OpenTable[]> {
    const {
      dataSources: { prisma },
    } = context
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    })
    if (!user) return []
    const openWelcomeTable = await getOpenWelcomeTable(context)(meetings)
    const openTables = await openTablesFromOpenMeetings(prisma)({ meetings, user })
    return [openWelcomeTable, ...openTables]
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

type MeetingInfoUnionUser = {
  meetings: MeetingInfo[]
  user: User
}

const openTablesFromOpenMeetings =
  (prisma: PrismaClient) =>
  async (arg: MeetingInfoUnionUser): Promise<OpenTable[]> => {
    if (!arg.meetings.length) return []
    const dbMeetings = await prisma.meeting.findMany({
      where: {
        meetingID: { in: arg.meetings.map((m: MeetingInfo) => m.meetingID) },
        OR: [
          {
            public: true,
          },
          {
            users: {
              some: {
                userId: arg.user.id,
              },
            },
          },
          arg.user.meetingId
            ? {
                id: arg.user.meetingId,
              }
            : {},
        ],
      },
      select: {
        id: true,
        meetingID: true,
        public: true,
        users: true,
      },
    })

    const openTables: OpenTable[] = []
    dbMeetings.forEach((meeting) => {
      const meetingInfo = arg.meetings.find((m) => meeting.meetingID === m.meetingID)
      if (meetingInfo) {
        openTables.push(OpenTable.fromMeetingInfo(meetingInfo, meeting.id ? meeting.id : 0))
      }
    })
    return openTables
  }

const createUsersInMeetings =
  (prisma: PrismaClient) =>
  async (data: { userIds: number[]; meeting: Meeting; role?: AttendeeRole }) => {
    await prisma.usersInMeetings.createMany({
      data: data.userIds.map((id) => ({
        role: data.role,
        meetingId: data.meeting.id,
        userId: id,
      })),
    })
  }

const findUsersInMeetings =
  (prisma: PrismaClient) =>
  async (meeting: Meeting): Promise<UsersWithMeetings[]> => {
    return (await prisma.usersInMeetings.findMany({
      where: {
        meetingId: meeting.id,
      },
      include: {
        user: true,
      },
    })) as UsersWithMeetings[]
  }

const createMeetingID = (prisma: PrismaClient) => async (): Promise<string> => {
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

const createBBBMeeting =
  (prisma: PrismaClient) =>
  async (data: {
    meetingID: string
    name: string
    inviteLink: string
    tableId: number
  }): Promise<CreateMeetingResponse> => {
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

const getOpenWelcomeTable = (context: Context) => async (meetings: MeetingInfo[]) => {
  const {
    config,
    dataSources: { prisma },
  } = context
  const welcomeTable = await prisma.meeting.findFirstOrThrow({
    where: {
      meetingID: config.WELCOME_TABLE_MEETING_ID,
    },
  })
  const welcomeMeeting = meetings.find((m) => m.meetingID === config.WELCOME_TABLE_MEETING_ID)
  const attendees = welcomeMeeting
    ? typeof welcomeMeeting.attendees !== 'string'
      ? Array.isArray(welcomeMeeting.attendees.attendee)
        ? welcomeMeeting.attendees.attendee.map((a: AttendeeInfo) => new Attendee(a))
        : [welcomeMeeting.attendees.attendee]
      : []
    : []
  return new OpenTable({
    id: welcomeTable.id,
    meetingID: config.WELCOME_TABLE_MEETING_ID,
    meetingName: config.WELCOME_TABLE_NAME,
    participantCount: welcomeMeeting?.participantCount ?? 0,
    startTime: new Date(welcomeMeeting?.startTime ?? 0).toISOString(),
    attendees,
  })
}
