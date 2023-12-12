import { deleteAll, disconnect } from './helpers'

beforeAll(async () => {
  await deleteAll()
})

afterAll(async () => {
  await deleteAll()
  await disconnect()
})
