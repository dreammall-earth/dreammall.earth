import fs from 'node:fs'

import { User } from '@prisma/client'
import { verify, JwtPayload } from 'jsonwebtoken'
import { AuthChecker } from 'type-graphql'

import { EVENT_CREATE_USER } from '#src/event/Events'
import { Context } from '#src/server/context'

import type { prisma as Prisma } from '#src/prisma'

interface CustomJwtPayload extends JwtPayload {
  nickname: string
  name: string
}

let cert: Buffer

export const getCert = (): Buffer => {
  if (!cert) {
    // eslint-disable-next-line n/no-sync
    cert = fs.readFileSync('public.pem')
  }
  return cert
}

export const authChecker: AuthChecker<Context> = async ({ context }) => {
  const { token, dataSources } = context
  const { prisma } = dataSources

  if (!token) return false

  let decoded
  try {
    decoded = verify(token, getCert()) as CustomJwtPayload
  } catch (err) {
    return false
  }

  if (decoded) {
    const { nickname, name } = decoded
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
    void EVENT_CREATE_USER(user.id)
    return user
  }
