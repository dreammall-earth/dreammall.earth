import { describe, it, expect } from 'vitest'

import { META } from './env'

describe('env', () => {
  it('has correct default values', () => {
    expect(META).toEqual({
      BASE_URL: 'http://localhost:3000',
      DEFAULT_AUTHOR: 'DreamMall Verlag GbR',
      DEFAULT_DESCRIPTION:
        'Deine Reichweite Erweitern Alle Möglichkeiten Miteinander Ausschöpfen Lebensqualität Leben',
      DEFAULT_TITLE: 'DreamMall',
    })
  })
})
