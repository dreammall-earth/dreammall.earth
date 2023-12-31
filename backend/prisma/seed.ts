import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {}

main()
  .then(async () => {
    await prisma.$disconnect()
    return undefined
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e)
    await prisma.$disconnect()
    throw e
  })
