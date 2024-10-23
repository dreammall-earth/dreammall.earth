import { customAlphabet } from 'nanoid'

import { CONFIG } from '#config/config'
import { EVENT_CREATE_USER } from '#src/event/Events'

import { migratePk } from './migratePk'

import type { PrismaClient, UserWithProfile } from '#src/prisma'
import type { CustomJwtPayload } from './context'

const alphabet = '0123456789ABCDEFGHIJKLMNPQRSTUVWXYZ' // let's omit 'O' because of confusion with '0'
const nanoid = customAlphabet(alphabet, 8)

export const findOrCreateUser =
  ({ prisma }: { prisma: PrismaClient }) =>
  async (payload: CustomJwtPayload): Promise<UserWithProfile> => {
    const { pk, nickname: username, name } = payload
    let user: UserWithProfile | null = await prisma.user.findUnique({
      where: {
        pk,
      },
      include: {
        meeting: true,
        userDetail: true,
        socialMedia: true,
      },
    })
    if (user) return user

    user = await migratePk({ prisma })(payload)
    if (user) return user

    const referenceId = nanoid()
    const testphaseEndsAt = new Date()
    testphaseEndsAt.setDate(testphaseEndsAt.getDate() + CONFIG.TESTPHASE_DURATION_DAYS)
  
    user = await prisma.user.create({
      data: {
        pk,
        username,
        name,
        referenceId,
        testphaseEndsAt,
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
