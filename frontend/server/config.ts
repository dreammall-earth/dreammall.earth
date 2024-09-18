// eslint-disable-next-line import/no-unassigned-import
import 'dotenv/config'

const {
  PUBLIC_ENV__AUTH__AUTHORITY = 'http://localhost:9000/application/o/dreammallearth/',
  PUBLIC_ENV__AUTH__AUTHORITY_SIGNUP_URI = 'http://localhost:9000/if/flow/dreammallearth-enrollment/',
  PUBLIC_ENV__AUTH__AUTHORITY_SIGNOUT_URI = 'http://localhost:9000/if/flow/dreammallearth-invalidation-flow/',
  PUBLIC_ENV__AUTH__CLIENT_ID = 'G3g0sjCjph1NAyGeeu5Te5ltx1I7WZ0DGB8i6vOI',
  PUBLIC_ENV__AUTH__REDIRECT_URI = 'http://localhost:3000/app/auth',
  PUBLIC_ENV__AUTH__SILENT_REDIRECT_URI = 'http://localhost:3000/app/silent-refresh',
  PUBLIC_ENV__AUTH__RESPONSE_TYPE = 'code',
  PUBLIC_ENV__AUTH__SCOPE = 'openid profile posts',

  PUBLIC_ENV__ENDPOINTS__GRAPHQL_URI = 'http://localhost:4000/',
  PUBLIC_ENV__ENDPOINTS__WEBSOCKET_URI = 'ws://localhost:4000/subscriptions',

  PUBLIC_ENV__META__BASE_URL = 'http://localhost:3000',
  PUBLIC_ENV__META__DEFAULT_AUTHOR = 'DreamMall Verlag GbR',

  PUBLIC_ENV__ACCOUNT_HOLDER = 'DreamMall GBR',
  PUBLIC_ENV__IBAN = 'DE75512108001245126199', // source: https://www.iban.com/structure
  PUBLIC_ENV__BIC = 'SOGEDEFFXXX', // source: https://www.iban.com/structure
} = process.env

const AUTH = {
  AUTHORITY: PUBLIC_ENV__AUTH__AUTHORITY,
  AUTHORITY_SIGNUP_URI: PUBLIC_ENV__AUTH__AUTHORITY_SIGNUP_URI,
  AUTHORITY_SIGNOUT_URI: PUBLIC_ENV__AUTH__AUTHORITY_SIGNOUT_URI,
  CLIENT_ID: PUBLIC_ENV__AUTH__CLIENT_ID,
  REDIRECT_URI: PUBLIC_ENV__AUTH__REDIRECT_URI,
  SILENT_REDIRECT_URI: PUBLIC_ENV__AUTH__SILENT_REDIRECT_URI,
  RESPONSE_TYPE: PUBLIC_ENV__AUTH__RESPONSE_TYPE,
  SCOPE: PUBLIC_ENV__AUTH__SCOPE,
}

const ENDPOINTS = {
  GRAPHQL_URI: PUBLIC_ENV__ENDPOINTS__GRAPHQL_URI,
  WEBSOCKET_URI: PUBLIC_ENV__ENDPOINTS__WEBSOCKET_URI,
}
const META = {
  BASE_URL: PUBLIC_ENV__META__BASE_URL,
  DEFAULT_AUTHOR: PUBLIC_ENV__META__DEFAULT_AUTHOR,
}

const ACCOUNTING = {
  ACCOUNT_HOLDER: PUBLIC_ENV__ACCOUNT_HOLDER,
  IBAN: PUBLIC_ENV__IBAN,
  BIC: PUBLIC_ENV__BIC,
}

export const publicEnv = { AUTH, ACCOUNTING, ENDPOINTS, META }
