import { jwtVerify, createRemoteJWKSet } from 'jose'

import { CONFIG } from '#config/config'
import { prisma } from '#src/prisma'

import { findOrCreateUser } from './findOrCreateUser'
import { getToken } from './getToken'

import type { PrismaClient, UserWithProfile } from '#src/prisma'

const JWKS = createRemoteJWKSet(new URL(CONFIG.JWKS_URI))

export type Context = {
  config: typeof CONFIG
  user: UserWithProfile
  dataSources: { prisma: PrismaClient }
}

export interface CustomJwtPayload {
  nickname: string
  name: string
}

export const unauthenticatedUser: UserWithProfile = {
  id: -1,
  referenceId: '0000000',
  createdAt: new Date(),
  name: 'Unauthenticated User',
  username: 'unauthenticatedUser',
  introduction: null,
  availability: null,
  meetingId: null,
  meeting: null,
  userDetail: [],
  socialMedia: [],
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

const getCurrentUser = async (authorization: string | undefined): Promise<UserWithProfile> => {
  const payload = await decodePayload(authorization)
  if (!payload) {
    return unauthenticatedUser
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
