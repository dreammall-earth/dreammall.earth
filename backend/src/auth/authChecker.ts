import fs from 'node:fs'

import { User } from '@prisma/client'
import { verify, JwtPayload } from 'jsonwebtoken'
import { AuthChecker } from 'type-graphql'

import { EVENT_CREATE_USER } from '#src/event/Events'
import { prisma } from '#src/prisma'
import { Context } from '#src/server/context'

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const authChecker: AuthChecker<Context> = async ({ root, args, context, info }, roles) => {
  const { token } = context
console.log(token)
  if (!token) return false

  try {
    const decoded = verify(token, getCert()) as CustomJwtPayload
    if (decoded) {
      const { nickname, name } = decoded
      const user = await contextUser(nickname, name)
      context.user = user
      return true
    }
  } catch {
    return false
  }

  return false
}

const contextUser = async (username: string, name: string): Promise<User> => {
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
