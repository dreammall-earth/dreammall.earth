import { Client } from 'ldapts'

import { CONFIG } from '#config/config'

import { getLdapClient } from './ldap'

CONFIG.LDAP_URL = 'ldapurl'
CONFIG.LDAP_ADMIN_DN = 'dn'
CONFIG.LDAP_ADMIN_PASSWORD = '1234'

const ldapBindMock = jest.fn()

jest.mock('ldapts', () => {
  const originalModule = jest.requireActual<typeof import('ldapts')>('ldapts')
  return {
    __esModule: true,
    ...originalModule,
    Client: jest.fn(() => {
      return {
        bind: ldapBindMock,
      }
    }),
  }
})

describe('ldap client', () => {
  beforeEach(async () => {
    await getLdapClient()
  })

  it('creates a LDAP Client', () => {
    expect(Client).toBeCalledWith({
      url: 'ldapurl',
    })
  })

  it('binds the client to admin', () => {
    expect(ldapBindMock).toBeCalledWith('dn', '1234')
  })
})
