import { describe, it, expect } from 'vitest'

import { META } from './env'

describe('env', () => {
  it('has correct default values', () => {
    expect(META).toStrictEqual({
      BASE_URL: 'http://localhost:3000',
      DEFAULT_AUTHOR: 'DreamMall Verlag GbR',
    })
  })
})
