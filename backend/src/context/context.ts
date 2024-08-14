import { jwtVerify, createRemoteJWKSet } from 'jose'

import { CONFIG } from '#config/config'
import { prisma } from '#src/prisma'

import { findOrCreateUser } from './findOrCreateUser'
import { getToken } from './getToken'

import type { prisma as Prisma, UserWithProfile } from '#src/prisma'
import type { ContextFunction } from '@apollo/server'
import type { ExpressContextFunctionArgument } from '@apollo/server/express4'

const JWKS = createRemoteJWKSet(new URL(CONFIG.JWKS_URI))

type Role = 'admin'
type UserWithProfileAndRoles = UserWithProfile & { roles: Role[] }

export type Context = {
  user: UserWithProfileAndRoles | null
  dataSources: { prisma: typeof Prisma }
}

export interface CustomJwtPayload {
  nickname: string
  name: string
  group_attributes: {
    roles?: Role[]
  }
}

const decodePayload = async (
  authorization: string | undefined,
): Promise<CustomJwtPayload | null> => {
  const token = getToken(authorization)
  if (!token) return null

  try {
    const { payload } = await jwtVerify<CustomJwtPayload>(token, JWKS)
    return payload
  } catch (err) {
    return null
  }
}

const getCurrentUser = async (
  authorization: string | undefined,
): Promise<UserWithProfileAndRoles | null> => {
  const payload = await decodePayload(authorization)
  if (!payload) {
    return null
  }
  const roles = payload.group_attributes.roles ?? []
  const dbUser = await findOrCreateUser(payload)
  return { ...dbUser, roles }
}

export const context: ContextFunction<[ExpressContextFunctionArgument], Context> = async ({
  req,
}) => {
  const user = await getCurrentUser(req.headers.authorization)
  return {
    user,
    dataSources: {
      prisma,
    },
  }
}
