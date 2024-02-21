// eslint-disable-next-line import/no-unassigned-import
import 'reflect-metadata'
import { prisma } from './prisma'
import { getLdapClient } from './server/ldap'
import { listen } from './server/server'

export const main = async (): Promise<void> => {
  await getLdapClient()
  // eslint-disable-next-line no-console
  console.log(`🚀 LDAP client is ready`)
  const url = await listen(4000)
  // eslint-disable-next-line no-console
  console.log(`🚀 Server is ready at ${url}`)
}

void main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e)
    throw e
  })
  .finally(() => {
    void prisma.$disconnect()
  })
