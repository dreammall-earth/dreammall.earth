import { EVENT_CREATE_USER } from '#src/event/Events'
import { prisma } from '#src/prisma'

import type { UserWithProfile } from '#src/prisma'
import type { CustomJwtPayload } from './context'

export const findOrCreateUser = async (
  payload: Pick<CustomJwtPayload, 'nickname' | 'name'>,
): Promise<UserWithProfile> => {
  const { nickname: username, name } = payload
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
  if (user) return user
  user = await prisma.user.create({
    data: {
      username,
      name,
    },
    include: {
      meeting: true,
      userDetail: true,
      socialMedia: true,
    },
  })
  await EVENT_CREATE_USER(user.id)
  return user
}
