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
        referenceId: faker.string.alphanumeric({ length: 8, casing: 'upper', exclude: 'O' }),
      },
      {
        username: 'peter',
        name: 'Peter Lustig',
        referenceId: faker.string.alphanumeric({ length: 8, casing: 'upper', exclude: 'O' }),
      },
      {
        username: 'bob',
        name: 'Bob der Baumeister',
        referenceId: faker.string.alphanumeric({ length: 8, casing: 'upper', exclude: 'O' }),
      },
      {
        username: 'raeuber',
        name: 'Räuber Hotzenplotz',
        referenceId: faker.string.alphanumeric({ length: 8, casing: 'upper', exclude: 'O' }),
      },
      ...Array.from(new Array(100), (_, i) => ({
        name: faker.person.fullName(),
        username: faker.internet.userName() + i,
        referenceId: faker.string.alphanumeric({ length: 8, casing: 'upper', exclude: 'O' }),
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
