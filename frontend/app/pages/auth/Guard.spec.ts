import { PageContextServer } from 'vike/types'
import { describe, it, expect } from 'vitest'

import { guard } from './+guard'

let pageContext: PageContextServer

describe('auth page guard', () => {
  it('returns void', async () => {
    await expect(guard(pageContext)).resolves.toBeUndefined()
  })
})
