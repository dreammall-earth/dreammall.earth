import { jwtVerify, createRemoteJWKSet } from 'jose'

import { CONFIG } from '#config/config'

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
  pk: number
  name: string
  nickname: string
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

const getCurrentUser =
  (deps: { prisma: PrismaClient }) =>
  async (authorization: string | undefined): Promise<UserWithProfile | null> => {
    const payload = await decodePayload(authorization)
    if (!payload) {
      return null
    }
    return findOrCreateUser(deps)(payload)
  }

export const context: (deps: {
  prisma: PrismaClient
}) => (token: string | undefined) => Promise<Context> = (deps) => async (token) => {
  const { prisma } = deps
  const user = await getCurrentUser(deps)(token)
  return {
    user,
    config: CONFIG,
    dataSources: {
      prisma,
    },
  }
}
