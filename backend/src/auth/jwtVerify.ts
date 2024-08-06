import { jwtVerify as realJwtVerify } from 'jose'

import type { CustomJwtPayload } from './authChecker'

export const fakePayload = {
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
}

const fakeJwtVerify = (() =>
  Promise.resolve({
    payload: fakePayload,
  })) as unknown as typeof realJwtVerify<CustomJwtPayload>

// TODO: this is a temporary hack, see: https://github.com/dreammall-earth/dreammall.earth/issues/1503
// eslint-disable-next-line n/no-process-env
export const jwtVerify = process.env.NODE_ENV === 'test' ? fakeJwtVerify : realJwtVerify
