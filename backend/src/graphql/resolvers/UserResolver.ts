import { Prisma } from '@prisma/client'
import { Resolver, Query, Authorized, Ctx, Arg, Mutation, Int } from 'type-graphql'
// eslint-disable-next-line import/named
import { v4 as uuidv4 } from 'uuid'

import { UpdateUserDetailInput } from '#graphql/inputs/UpdateUserDetailInput'
import { User, CurrentUser, UserDetail, SocialMedia } from '#graphql/models/UserModel'
import { AddSocialMediaInput } from '#inputs/AddSocialMediaInput'
import { AddUserDetailInput } from '#inputs/AddUserDetailInput'
import { UpdateUserInput } from '#inputs/UpdateUserInput'

import type { AuthenticatedContext } from '#src/context'
import type { PrismaClient, UsersWithMeetings, UserWithProfile } from '#src/prisma'

@Resolver()
export class UserResolver {
  @Authorized()
  @Query(() => [User])
  async users(
    @Arg('includeSelf', { nullable: true }) includeSelf: boolean = false,
    @Arg('searchString', () => String, { nullable: true }) searchString: string | null | undefined,
    @Ctx() context: AuthenticatedContext,
  ): Promise<User[]> {
    const {
      user,
      dataSources: { prisma },
    } = context
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
  async currentUser(@Ctx() context: AuthenticatedContext): Promise<CurrentUser> {
    const {
      user,
      dataSources: { prisma },
    } = context
    return createCurrentUser(prisma)(user)
  }

  @Authorized()
  @Mutation(() => CurrentUser)
  async updateUser(
    @Arg('data') data: UpdateUserInput,
    @Ctx() context: AuthenticatedContext,
  ): Promise<CurrentUser> {
    const {
      user,
      dataSources: { prisma },
    } = context
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
    @Ctx() context: AuthenticatedContext,
  ): Promise<UserDetail> {
    const {
      user,
      dataSources: { prisma },
    } = context

    const detail = await prisma.userDetail.create({
      data: {
        userId: user.id,
        ...data,
      },
    })

    return new UserDetail(detail)
  }

  @Authorized()
  @Mutation(() => UserDetail)
  async updateUserDetail(
    @Arg('data') data: UpdateUserDetailInput,
    @Ctx() context: AuthenticatedContext,
  ): Promise<UserDetail> {
    const {
      user,
      dataSources: { prisma },
    } = context

    const detail = user.userDetail.find((d) => d.id === data.id)

    if (!detail) throw new Error('Detail not found!')

    const updatedDetail = await prisma.userDetail.update({
      where: {
        id: data.id,
      },
      data: {
        text: data.text,
        category: detail.category,
      },
    })

    return new UserDetail(updatedDetail)
  }

  @Authorized()
  @Mutation(() => Boolean)
  async removeUserDetail(
    @Arg('id', () => Int) id: number,
    @Ctx() context: AuthenticatedContext,
  ): Promise<boolean> {
    const {
      user,
      dataSources: { prisma },
    } = context

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
    @Ctx() context: AuthenticatedContext,
  ): Promise<SocialMedia> {
    const {
      user,
      dataSources: { prisma },
    } = context

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
    @Ctx() context: AuthenticatedContext,
  ): Promise<boolean> {
    const {
      user,
      dataSources: { prisma },
    } = context

    const socialMedia = user.socialMedia.find((s) => s.id === id)

    if (!socialMedia) throw new Error('Social media not found!')

    await prisma.socialMedia.delete({
      where: {
        id,
      },
    })

    return true
  }

  @Authorized()
  @Mutation(() => String)
  async createInvitationLink(@Ctx() context: AuthenticatedContext): Promise<string> {
    const {
      user,
      config,
      dataSources: { prisma },
    } = context
    const inviationCode = await createInvitationCode(prisma)()
    const dbInviationLink = await prisma.invitationLink.create({
      data: { code: inviationCode, userId: user.id },
    })
    return config.FRONTEND_URL + 'invite/' + dbInviationLink.code
  }

  @Authorized()
  @Mutation(() => Boolean)
  async redeemInvitationLink(
    @Arg('code') code: string,
    @Ctx() context: AuthenticatedContext,
  ): Promise<boolean> {
    const {
      user,
      dataSources: { prisma },
    } = context
    const invitationLink = await prisma.invitationLink.findUnique({
      where: {
        code,
      },
    })
    if (!invitationLink) {
      throw new Error('Invalid invitation code.')
    }
    if (invitationLink.acceptedUserId) {
      throw new Error('Link already used.')
    }
    if (user.id === invitationLink.userId) {
      throw new Error('Can not redeem own invitation code.')
    }
    await prisma.invitationLink.update({
      where: {
        code,
      },
      data: {
        acceptedUserId: user.id,
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

const createInvitationCode = (prisma: PrismaClient) => async (): Promise<string> => {
  let invitationCode: string = uuidv4()
  while (
    await prisma.invitationLink.count({
      where: {
        code: invitationCode,
      },
    })
  ) {
    invitationCode = uuidv4()
  }
  return invitationCode
}
