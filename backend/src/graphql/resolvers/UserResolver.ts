import { Resolver, Query, Ctx, Authorized } from 'type-graphql'

import { User, CurrentUser } from '#graphql/models/UserModel'
import { prisma, UsersWithMeetings } from '#src/prisma'
import { Context } from '#src/server/context'

@Resolver()
export class UserResolver {
  @Authorized()
  @Query(() => [User])
  async users(): Promise<User[]> {
    return prisma.user.findMany()
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
