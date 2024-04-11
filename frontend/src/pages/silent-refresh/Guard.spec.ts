import { PageContextServer } from 'vike/types'
import { describe, it, expect } from 'vitest'

import { guard } from './+guard'

let pageContext: PageContextServer

describe('signin page guard', () => {
  it('returns void', async () => {
    expect(await guard(pageContext)).toBe(undefined)
  })
})
