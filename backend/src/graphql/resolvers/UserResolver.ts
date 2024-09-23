import { Prisma } from '@prisma/client'
import { Resolver, Query, Authorized, Ctx, Arg, Mutation, Int } from 'type-graphql'

import { User, CurrentUser, UserDetail, SocialMedia } from '#graphql/models/UserModel'
import { AddSocialMediaInput } from '#inputs/AddSocialMediaInput'
import { AddUserDetailInput } from '#inputs/AddUserDetailInput'
import { UpdateUserInput } from '#inputs/UpdateUserInput'

import type { Context } from '#src/context'
import type { PrismaClient, UsersWithMeetings, UserWithProfile } from '#src/prisma'

@Resolver()
export class UserResolver {
  @Authorized()
  @Query(() => [User])
  async users(
    @Arg('includeSelf', { nullable: true }) includeSelf: boolean = false,
    @Arg('searchString', () => String, { nullable: true }) searchString: string | null | undefined,
    @Ctx() context: Context,
  ): Promise<User[]> {
    const {
      user,
      dataSources: { prisma },
    } = context
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
    const {
      user,
      dataSources: { prisma },
    } = context
    if (!user) throw new Error('User not found!')

    return createCurrentUser(prisma)(user)
  }

  @Authorized()
  @Mutation(() => CurrentUser)
  async updateUser(
    @Arg('data') data: UpdateUserInput,
    @Ctx() context: Context,
  ): Promise<CurrentUser> {
    const {
      user,
      dataSources: { prisma },
    } = context
    if (!user) throw new Error('User not found!')

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data,
    })

    return createCurrentUser(prisma)({ ...user, ...updatedUser })
  }

  @Authorized()
  @Mutation(() => UserDetail)
  async addUserDetail(
    @Arg('data') data: AddUserDetailInput,
    @Ctx() context: Context,
  ): Promise<UserDetail> {
    const {
      user,
      dataSources: { prisma },
    } = context
    if (!user) throw new Error('User not found!')

    const detail = await prisma.userDetail.create({
      data: {
        userId: user.id,
        ...data,
      },
    })

    return new UserDetail(detail)
  }

  @Authorized()
  @Mutation(() => Boolean)
  async removeUserDetail(
    @Arg('id', () => Int) id: number,
    @Ctx() context: Context,
  ): Promise<boolean> {
    const {
      user,
      dataSources: { prisma },
    } = context
    if (!user) throw new Error('User not found!')

    const detail = user.userDetail.find((d) => d.id === id)

    if (!detail) throw new Error('Detail not found!')

    await prisma.userDetail.delete({
      where: {
        id,
      },
    })

    return true
  }

  @Authorized()
  @Mutation(() => SocialMedia)
  async addSocialMedia(
    @Arg('data') data: AddSocialMediaInput,
    @Ctx() context: Context,
  ): Promise<SocialMedia> {
    const {
      user,
      dataSources: { prisma },
    } = context
    if (!user) throw new Error('User not found!')

    const socialMedia = await prisma.socialMedia.create({
      data: {
        userId: user.id,
        ...data,
      },
    })

    return new SocialMedia(socialMedia)
  }

  @Authorized()
  @Mutation(() => Boolean)
  async removeSocialMedia(
    @Arg('id', () => Int) id: number,
    @Ctx() context: Context,
  ): Promise<boolean> {
    const {
      user,
      dataSources: { prisma },
    } = context
    if (!user) throw new Error('User not found!')

    const socialMedia = user.socialMedia.find((s) => s.id === id)

    if (!socialMedia) throw new Error('Social media not found!')

    await prisma.socialMedia.delete({
      where: {
        id,
      },
    })

    return true
  }
}

const createCurrentUser =
  (prisma: PrismaClient) =>
  async (user: UserWithProfile): Promise<CurrentUser> => {
    let usersInMeetings: UsersWithMeetings[] = []

    if (user.meetingId && !user.meeting?.public) {
      usersInMeetings = await prisma.usersInMeetings.findMany({
        where: { meetingId: user.meetingId },
        include: { user: true },
      })
    }

    return new CurrentUser(user, usersInMeetings)
  }
