import { describe, it, expect } from 'vitest'

import { trackingCode } from '.'

describe('trackingCode', () => {
  it('renders empty string by default', () => {
    expect(trackingCode(undefined)).toBe('')
  })

  describe('given a websiteId', () => {
    it('renders tracking code', () => {
      expect(trackingCode('848016ec-3c22-403c-86be-9b21864d1256')).toBe(
        '<script defer src="https://cloud.umami.is/script.js" data-website-id="848016ec-3c22-403c-86be-9b21864d1256"></script>',
      )
    })
  })
})
