import fs from 'node:fs'

import { verify } from 'jsonwebtoken'
import { AuthChecker } from 'type-graphql'

import { Context } from '#src/server/context'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const authChecker: AuthChecker<Context> = ({ root, args, context, info }, roles) => {
  const { token } = context

  if (!token) return false

  // eslint-disable-next-line n/no-sync
  const cert = fs.readFileSync('public.pem')

  try {
    const decoded = verify(token, cert)
    if (decoded) {
      return true
    }
  } catch {
    return false
  }

  return false
}
