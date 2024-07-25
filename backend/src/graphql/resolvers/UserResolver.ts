import { Prisma } from '@prisma/client'
import { Resolver, Query, Authorized, Ctx, Arg } from 'type-graphql'

import { User, CurrentUser } from '#graphql/models/UserModel'
import { prisma, UsersWithMeetings } from '#src/prisma'
import { Context } from '#src/server/context'

@Resolver()
export class UserResolver {
  @Authorized()
  @Query(() => [User])
  async users(
    @Arg('includeSelf', { nullable: true }) includeSelf: boolean = false,
    @Arg('searchString', { nullable: true }) searchString: string = '',
    @Ctx() context: Context,
  ): Promise<User[]> {
    const { user } = context
    if (!user) return []
    const where: Prisma.UserWhereInput = {}
    if (!includeSelf) {
      where.NOT = { id: user.id }
    }

    if (searchString) {
      where.OR = [{ name: { contains: searchString } }, { username: { contains: searchString } }]
    }

    return prisma.user.findMany({
      where,
    })
  }

  @Authorized()
  @Query(() => CurrentUser)
  async currentUser(@Ctx() context: Context): Promise<CurrentUser> {
    const { user } = context
    if (!user) throw new Error('User not found!')

    const myself = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        meeting: true,
      },
    })

    if (!myself) throw new Error('User not found in DB!')

    let usersInMeetings: UsersWithMeetings[] = []

    if (myself.meetingId && !myself.meeting?.public) {
      usersInMeetings = await prisma.usersInMeetings.findMany({
        where: { meetingId: myself.meetingId },
        include: { user: true },
      })
    }

    return new CurrentUser(myself, myself.meeting, usersInMeetings)
  }
}
