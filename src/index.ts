// eslint-disable-next-line import/no-unassigned-import
import 'reflect-metadata'
import { listen } from './server/server'

export async function main() {
  await listen(4000)
  // eslint-disable-next-line no-console
  console.log('🚀 Server is ready at http://localhost:4000/graphql')
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e)
  throw e
})
