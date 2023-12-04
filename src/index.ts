// eslint-disable-next-line import/no-unassigned-import
import 'reflect-metadata'
import { main } from './server/server'

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e)
  throw e
})
