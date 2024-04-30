import { createHash } from 'crypto'

import { CONFIG } from '#config/config'

export const createChecksum = (params: string, callName: string): string => {
  const hash = createHash('sha1')
  hash.update(callName + params + CONFIG.BBB_SHARED_SECRET)
  return hash.digest('hex')
}
