import { EVENT_CREATE_USER } from '#src/event/Events'
import userRepository from '#src/Repositories/UserRepository'

import type { UserWithProfile } from '#src/prisma'
import type { CustomJwtPayload } from './context'

export const findOrCreateUser = async (payload: CustomJwtPayload): Promise<UserWithProfile> => {
  const { nickname: username, name } = payload
  let user: UserWithProfile | null = (await userRepository.findUnique({
    where: {
      username,
    },
    include: {
      meeting: true,
      userDetail: true,
      socialMedia: true,
    },
  })) as UserWithProfile
  if (user) return user
  user = (await userRepository.create({
    data: {
      username,
      name,
    },
    include: {
      meeting: true,
      userDetail: true,
      socialMedia: true,
    },
  })) as UserWithProfile

  await EVENT_CREATE_USER(user.id)
  return user
}
