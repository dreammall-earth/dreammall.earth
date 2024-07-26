import { User } from '@prisma/client'
import { createRemoteJWKSet } from 'jose'
import { AuthChecker } from 'type-graphql'

import { CONFIG } from '#config/config'
import { EVENT_CREATE_USER } from '#src/event/Events'
import { Context } from '#src/server/context'

import { jwtVerify } from './jwtVerify'

import type { prisma as Prisma } from '#src/prisma'

export interface CustomJwtPayload {
  nickname: string
  name: string
}

const JWKS = createRemoteJWKSet(new URL(CONFIG.JWKS_URI))

export const authChecker: AuthChecker<Context> = async ({ context }) => {
  const { token, dataSources } = context
  const { prisma } = dataSources

  if (!token) return false

  let payload: CustomJwtPayload
  try {
    const decoded = await jwtVerify<CustomJwtPayload>(token, JWKS)
    payload = decoded.payload
  } catch (err) {
    return false
  }

  if (payload) {
    const { nickname, name } = payload
    const user = await contextUser(prisma)(nickname, name)
    context.user = user
    return true
  }

  return false
}

const contextUser =
  (prisma: typeof Prisma) =>
  async (username: string, name: string): Promise<User> => {
    let user: User | null = await prisma.user.findUnique({
      where: {
        username,
      },
    })
    if (user) return user
    user = await prisma.user.create({
      data: {
        username,
        name,
      },
    })
    await EVENT_CREATE_USER(user.id)
    return user
  }
