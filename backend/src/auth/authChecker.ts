import { User } from '@prisma/client'
import { createRemoteJWKSet } from 'jose'
import { AuthChecker } from 'type-graphql'

import { EVENT_CREATE_USER } from '#src/event/Events'
import { Context } from '#src/server/context'

import { jwtVerify } from './jwtVerify'

import type { prisma as Prisma } from '#src/prisma'

export interface CustomJwtPayload {
  nickname: string
  name: string
}

// eslint-disable-next-line n/no-process-env
const { JWKS_URI } = process.env
if (!JWKS_URI) {
  throw new Error('missing environment variable: JWKS_URI')
}
const JWKS = createRemoteJWKSet(new URL(JWKS_URI))

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
