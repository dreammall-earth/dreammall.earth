// eslint-disable-next-line import/no-unassigned-import
import 'dotenv/config'

const {
  PUBLIC_ENV__SIGNUP_URI = '',
  PUBLIC_ENV__SIGNIN_URI = '',
  PUBLIC_ENV__ENDPOINTS__GRAPHQL_URI = 'http://localhost:4000/',
  PUBLIC_ENV__META__BASE_URL = 'http://localhost:3001',
  PUBLIC_ENV__META__DEFAULT_AUTHOR = 'DreamMall Verlag GbR',

  SENTRY_DSN,
  SENTRY_ENVIRONMENT,
} = process.env

const AUTH = {
  SIGNUP_URI: PUBLIC_ENV__SIGNUP_URI,
  SIGNIN_URI: PUBLIC_ENV__SIGNIN_URI,
}
const ENDPOINTS = { GRAPHQL_URI: PUBLIC_ENV__ENDPOINTS__GRAPHQL_URI }
const META = {
  BASE_URL: PUBLIC_ENV__META__BASE_URL,
  DEFAULT_AUTHOR: PUBLIC_ENV__META__DEFAULT_AUTHOR,
}

const SENTRY = {
  SENTRY_DSN,
  SENTRY_ENVIRONMENT,
}

export const publicEnv = { AUTH, ENDPOINTS, META, SENTRY }
