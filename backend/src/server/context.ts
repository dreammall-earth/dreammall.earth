import type { prisma, UserWithProfile } from '#src/prisma'

export type Context = {
  token?: string
  user?: UserWithProfile | undefined
  dataSources: { prisma: typeof prisma }
}

export type GetContextToken = (authorization: string | undefined) => string | undefined

export const getContextToken: GetContextToken = (authorization) => {
  return authorization ? authorization.replace(/^[Bb]earer */, '') : undefined
}
