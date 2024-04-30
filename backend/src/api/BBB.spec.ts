// eslint-disable-next-line import/named
import { AxiosHeaders, InternalAxiosRequestConfig } from 'axios'

import { CONFIG } from '#config/config'

import { createChecksum, addChecksumParam } from './BBB'

// values taken form https://docs.bigbluebutton.org/development/api/#usage
CONFIG.BBB_SHARED_SECRET = '639259d4-9dd8-4b25-bf01-95f9567eaf4b'
CONFIG.BBB_URL = 'https://my.url'

describe('createChecksum', () => {
  describe('callName without slash', () => {
    it('returns sha1 hash', () => {
      expect(
        createChecksum(
          'create',
          'name=Test+Meeting&meetingID=abc123&attendeePW=111222&moderatorPW=333444',
        ),
      ).toBe('1fcbb0c4fc1f039f73aa6d697d2db9ba7f803f17')
    })
  })

  describe('callName with slash', () => {
    it('returns sha1 hash', () => {
      expect(
        createChecksum(
          '/create',
          'name=Test+Meeting&meetingID=abc123&attendeePW=111222&moderatorPW=333444',
        ),
      ).toBe('1fcbb0c4fc1f039f73aa6d697d2db9ba7f803f17')
    })
  })

  describe('without params', () => {
    it('returns sha1 hash', () => {
      expect(createChecksum('/create')).toBe('8a21c9b7e3b18541974c9e78c0d0bfa790c665eb')
    })
  })
})

describe('addChecksumParam', () => {
  const config: InternalAxiosRequestConfig = {
    baseURL: CONFIG.BBB_URL,
    headers: new AxiosHeaders(),
  }

  describe('url /create', () => {
    config.url = '/create'

    describe('no params', () => {
      it('adds checksum', () => {
        expect(addChecksumParam(config)).toMatchObject({
          params: {
            checksum: '8a21c9b7e3b18541974c9e78c0d0bfa790c665eb',
          },
        })
      })
    })

    describe('with params', () => {
      it('adds checksum', () => {
        expect(
          addChecksumParam({
            ...config,
            params: {
              name: 'Test Meeting',
              meetingID: 'abc123',
              attendeePW: '111222',
              moderatorPW: '333444',
            },
          }),
        ).toMatchObject({
          params: {
            name: 'Test Meeting',
            meetingID: 'abc123',
            attendeePW: '111222',
            moderatorPW: '333444',
            checksum: '1fcbb0c4fc1f039f73aa6d697d2db9ba7f803f17',
          },
        })
      })
    })
  })
})
