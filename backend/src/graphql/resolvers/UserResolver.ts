import { Resolver, Query } from 'type-graphql'

import { User } from '#graphql/models/UserModel'
import { prisma } from '#src/prisma'

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users(): Promise<User[]> {
    return prisma.user.findMany()
  }
}
