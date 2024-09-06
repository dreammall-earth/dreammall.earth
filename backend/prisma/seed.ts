// eslint-disable-next-line n/no-unpublished-import
import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const seedUsers = async () => {
  await prisma.user.createMany({
    data: [
      {
        username: 'bibi',
        name: 'Bibi Bloxberg',
      },
      {
        username: 'peter',
        name: 'Peter Lustig',
      },
      {
        username: 'bob',
        name: 'Bob der Baumeister',
      },
      {
        username: 'raeuber',
        name: 'Räuber Hotzenplotz',
      },
      ...Array.from(new Array(100), () => ({
        name: faker.person.fullName(),
        username: faker.internet.userName(),
      })),
    ],
  })
}

async function main() {
  await seedUsers()
}

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
