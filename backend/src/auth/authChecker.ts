import fs from 'node:fs'

import { verify } from 'jsonwebtoken'
import { AuthChecker } from 'type-graphql'

import { Context } from '#src/server/context'

let cert: Buffer

const getCert = (): Buffer => {
  if (!cert) {
    // eslint-disable-next-line n/no-sync
    cert = fs.readFileSync('public.pem')
  }
  return cert
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const authChecker: AuthChecker<Context> = ({ root, args, context, info }, roles) => {
  const { token } = context

  if (!token) return false

  try {
    const decoded = verify(token, getCert())
    if (decoded) {
      return true
    }
  } catch {
    return false
  }

  return false
}
