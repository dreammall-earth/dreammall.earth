import { jwtVerify, createRemoteJWKSet, errors } from 'jose'

import { CONFIG } from '#config/config'
import { createBrevoClient } from '#src/api/Brevo'
import logger from '#src/logger'

import { findOrCreateUser } from './findOrCreateUser'
import { getToken } from './getToken'

import type { BrevoClient } from '#src/api/Brevo'
import type { PrismaClient, UserWithProfile } from '#src/prisma'
import type { Sentry } from '#src/server/sentry'

const JWKS = createRemoteJWKSet(new URL(CONFIG.JWKS_URI))

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
  brevo: BrevoClient
  sentry: Sentry
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

export type ContextDependencies = {
  prisma: PrismaClient
  sentry: Sentry
}

export const context: (
  deps: ContextDependencies,
) => (token: string | undefined) => Promise<Context> = (deps) => async (token) => {
  const { sentry, prisma } = deps
  const brevo = createBrevoClient({ prisma, logger, config: CONFIG, sentry })
  const user = await getCurrentUser(deps)(token)
  return {
    user,
    config: CONFIG,
    brevo,
    dataSources: {
      prisma,
    },
    sentry,
  }
}
