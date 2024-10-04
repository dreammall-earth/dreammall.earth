import type { PrismaClient, UserWithProfile } from '#src/prisma'
import type { CustomJwtPayload } from './context'

export const migratePk =
  ({ prisma }: { prisma: PrismaClient }) =>
  async (payload: CustomJwtPayload): Promise<UserWithProfile | null> => {
    const { pk, nickname: username } = payload
    let user: UserWithProfile | null = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        meeting: true,
        userDetail: true,
        socialMedia: true,
      },
    })
    if (user) {
      user = await prisma.user.update({
        where: {
          username,
        },
        data: {
          pk,
        },
        include: {
          meeting: true,
          userDetail: true,
          socialMedia: true,
        },
      })
      return user
    }
    return null
  }
