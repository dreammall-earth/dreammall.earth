import { Prisma, User } from '@prisma/client'
import { InternalArgs } from '@prisma/client/runtime/library'

import { prisma } from '#src/prisma'

export class UserRepository {
  public async create(data: Prisma.UserCreateArgs<InternalArgs>): Promise<User> {
    return prisma.user.create(data)
  }

  public async findUnique(data: Prisma.UserFindUniqueArgs<InternalArgs>): Promise<User | null> {
    return prisma.user.findUnique(data)
  }

  /**
   * update
   * data: UserModel
   */
  public async update(data: Prisma.UserUpdateArgs<InternalArgs>): Promise<User> {
    return prisma.user.update(data)
  }
}

const userRepository: UserRepository = new UserRepository()

export default userRepository
