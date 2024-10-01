import { customAlphabet } from 'nanoid'

import { EVENT_CREATE_USER } from '#src/event/Events'
import { prisma } from '#src/prisma'

import type { UserWithProfile } from '#src/prisma'
import type { CustomJwtPayload } from './context'

const alphabet = '0123456789ABCDEFGHIJKLMNPQRSTUVWXYZ' // let's omit 'O' because of confusion with '0'
const nanoid = customAlphabet(alphabet, 8)

export const findOrCreateUser = async (payload: CustomJwtPayload): Promise<UserWithProfile> => {
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
  const referenceId = nanoid()
  user = await prisma.user.create({
    data: {
      username,
      name,
      referenceId,
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
