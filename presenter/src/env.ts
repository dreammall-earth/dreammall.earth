const AUTH = {
  SIGNUP_URI: (import.meta.env.PUBLIC_ENV__SIGNUP_URI ?? '') as string,
  SIGNIN_URI: (import.meta.env.PUBLIC_ENV__SIGNIN_URI ?? '') as string,
}

const ENDPOINTS = {
  GRAPHQL_URI: (import.meta.env.PUBLIC_ENV__ENDPOINTS__GRAPHQL_URI ??
    'http://localhost:4000/') as string,
}

const META = {
  BASE_URL: (import.meta.env.PUBLIC_ENV__META__BASE_URL ?? 'http://localhost:3000') as string,
  DEFAULT_AUTHOR: (import.meta.env.PUBLIC_ENV__META__DEFAULT_AUTHOR ??
    'DreamMall Verlag GbR') as string,
}

export { AUTH, ENDPOINTS, META }
