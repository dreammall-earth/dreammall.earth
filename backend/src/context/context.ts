import { jwtVerify, createRemoteJWKSet, errors } from 'jose'

import { CONFIG } from '#config/config'
import { createBrevoClient } from '#src/api/Brevo'
import logger from '#src/logger'
import { prisma } from '#src/prisma'

import { findOrCreateUser } from './findOrCreateUser'
import { getToken } from './getToken'

import type { PrismaClient, UserWithProfile } from '#src/prisma'

const JWKS = createRemoteJWKSet(new URL(CONFIG.JWKS_URI))

const brevo = createBrevoClient({ prisma, logger, config: CONFIG })

const knownErrorClasses = [
  errors.JOSEAlgNotAllowed,
  errors.JOSENotSupported,
  errors.JWKSNoMatchingKey,
  errors.JWSInvalid,
  errors.JWSSignatureVerificationFailed,
  errors.JWTExpired,
  errors.JWTInvalid,
]

export type Context = {
  config: typeof CONFIG
  user: UserWithProfile | null
  dataSources: { prisma: PrismaClient }
  brevo: typeof brevo
}

export type AuthenticatedContext = Omit<Context, 'user'> & { user: UserWithProfile }

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
  } catch (error) {
    if (knownErrorClasses.some((errorClass) => error instanceof errorClass)) {
      logger.trace(error)
      return null
    } else throw error
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
    brevo,
    dataSources: {
      prisma,
    },
  }
}
