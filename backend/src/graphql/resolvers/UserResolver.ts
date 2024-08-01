import { Prisma } from '@prisma/client'
import { Resolver, Query, Authorized, Ctx, Arg, Mutation } from 'type-graphql'

import { User, CurrentUser } from '#graphql/models/UserModel'
import { UpdateUserInput } from '#inputs/UpdateUserInput'
import { prisma, UsersWithMeetings, UserWithProfile } from '#src/prisma'
import { Context } from '#src/server/context'

@Resolver()
export class UserResolver {
  @Authorized()
  @Query(() => [User])
  async users(
    @Arg('includeSelf', { nullable: true }) includeSelf: boolean = false,
    @Arg('searchString', () => String, { nullable: true }) searchString: string | null | undefined,
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

    return createCurrentUser(user)
  }

  @Authorized()
  @Mutation(() => CurrentUser)
  async updateUser(
    @Arg('updateUserInput') updateUserInput: UpdateUserInput,
    @Ctx() context: Context,
  ): Promise<CurrentUser> {
    const { user } = context
    if (!user) throw new Error('User not found!')

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...updateUserInput,
      },
    })

    return createCurrentUser({ ...user, ...updateUserInput })
  }
}

const createCurrentUser = async (user: UserWithProfile): Promise<CurrentUser> => {
  let usersInMeetings: UsersWithMeetings[] = []

  if (user.meetingId && !user.meeting?.public) {
    usersInMeetings = await prisma.usersInMeetings.findMany({
      where: { meetingId: user.meetingId },
      include: { user: true },
    })
  }

  return new CurrentUser(user, usersInMeetings)
}
