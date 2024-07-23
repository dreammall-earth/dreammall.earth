import { User } from '@prisma/client'

import type { prisma } from '#src/prisma'

export type Context = {
  token?: string
  user?: User | undefined
  dataSources: { prisma: typeof prisma }
}

export type GetContextToken = (authorization: string | undefined) => string | undefined

export const getContextToken: GetContextToken = (authorization) => {
  return authorization ? authorization.replace(/^[Bb]earer */, '') : undefined
}
