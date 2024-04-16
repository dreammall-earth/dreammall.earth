// eslint-disable-next-line import/no-unassigned-import
import 'reflect-metadata'
import path from 'path'

import { config } from 'dotenv'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { verify } from 'jsonwebtoken'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getCert } from '#src/auth/authChecker'
import logger from '#src/logger'

config({
  path: path.resolve(__dirname, '../.env.dist'),
})

// Only display log level warn
logger.settings.minLevel = 4

export const verifyTokenMock = jest.fn().mockResolvedValue({
  iss: 'issuer',
  sub: 'subject',
  aud: 'audience',
  exp: 1712689370,
  iat: 1712689070,
  auth_time: 1712689065,
  acr: 'acr',
  name: 'User',
  given_name: 'Mocked',
  preferred_username: 'mockedUser',
  nickname: 'mockedUser',
  groups: ['User'],
  azp: 'azp',
  uid: 'uid',
})

jest.mock('jsonwebtoken', () => {
  const originalModule = jest.requireActual<typeof import('jsonwebtoken')>('jsonwebtoken')
  return {
    __esModule: true,
    ...originalModule,
    verify: verifyTokenMock,
  }
})

export const getCertMock = jest.fn().mockImplementation(() => {
  return Buffer.from('token', 'hex')
})

jest.mock('#src/auth/authChecker', () => {
  const originalModule =
    jest.requireActual<typeof import('#src/auth/authChecker')>('#src/auth/authChecker')
  return {
    __esModule: true,
    ...originalModule,
    getCert: getCertMock,
  }
})
