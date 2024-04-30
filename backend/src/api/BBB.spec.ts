import { CONFIG } from '#config/config'

import { createChecksum } from './BBB'

// values taken form https://docs.bigbluebutton.org/development/api/#usage
CONFIG.BBB_SHARED_SECRET = '639259d4-9dd8-4b25-bf01-95f9567eaf4b'

describe('createChecksum', () => {
  it('returns sha1 hash', () => {
    expect(
      createChecksum(
        'name=Test+Meeting&meetingID=abc123&attendeePW=111222&moderatorPW=333444',
        'create',
      ),
    ).toBe('1fcbb0c4fc1f039f73aa6d697d2db9ba7f803f17')
  })
})
