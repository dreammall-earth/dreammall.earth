// eslint-disable-next-line import/no-unassigned-import
import 'reflect-metadata'
import { listen } from './server/server'

export async function main() {
  const url = await listen(4000)
  // eslint-disable-next-line no-console
  console.log(`🚀 Server is ready at ${url}`)
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e)
  throw e
})
