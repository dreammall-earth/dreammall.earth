import { jwtVerify, createRemoteJWKSet } from 'jose'

import { CONFIG } from '#config/config'
import { prisma } from '#src/prisma'

import { findOrCreateUser } from './findOrCreateUser'
import { getToken } from './getToken'

import type { PrismaClient, UserWithProfile } from '#src/prisma'

const JWKS = createRemoteJWKSet(new URL(CONFIG.JWKS_URI))

export type Context = {
  config: typeof CONFIG
  user: UserWithProfile | null
  dataSources: { prisma: PrismaClient }
}

export interface CustomJwtPayload {
  nickname: string
  name: string
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
): Promise<UserWithProfile | null> => {
  const payload = await decodePayload(authorization)
  if (!payload) {
    return null
  }
  return findOrCreateUser(payload)
}

export const context: (token: string | undefined) => Promise<Context> = async (token) => {
  const user = await getCurrentUser(token)
  return {
    user,
    config: CONFIG,
    dataSources: {
      prisma,
    },
  }
}
