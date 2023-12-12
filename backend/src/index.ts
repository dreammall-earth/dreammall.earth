// eslint-disable-next-line import/no-unassigned-import
import 'reflect-metadata'
import { prisma } from './prisma'
import { listen } from './server/server'

export const main = async (): Promise<void> => {
  const url = await listen(4000)
  // eslint-disable-next-line no-console
  console.log(`🚀 Server is ready at ${url}`)
}

// eslint-disable-next-line promise/catch-or-return
main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e)
    throw e
  })
  .finally(() => {
    void prisma.$disconnect()
  })
