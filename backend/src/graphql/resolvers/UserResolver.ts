import { Prisma } from '@prisma/client'
import { Resolver, Query, Authorized, Ctx, Arg } from 'type-graphql'

import { User } from '#graphql/models/UserModel'
import { prisma } from '#src/prisma'
import { Context } from '#src/server/context'

@Resolver()
export class UserResolver {
  @Authorized()
  @Query(() => [User])
  async users(
    @Arg('includeSelf', { nullable: true }) includeSelf: boolean = false,
    @Ctx() context: Context,
  ): Promise<User[]> {
    const { user } = context
    if (!user) return []
    const where: Prisma.UserWhereInput = {}
    if (!includeSelf) {
      where.NOT = { id: user.id }
    }
    return prisma.user.findMany({
      where,
    })
  }
}
