const AUTH = {
  AUTHORITY: (import.meta.env.PUBLIC_ENV__AUTH__AUTHORITY ??
    'http://localhost:9000/application/o/dreammallearth/') as string,
  AUTHORITY_SIGNUP_URI: (import.meta.env.PUBLIC_ENV__AUTH__AUTHORITY_SIGNUP_URI ??
    'http://localhost:9000/if/flow/dreammallearth-enrollment/') as string,
  AUTHORITY_SIGNOUT_URI: (import.meta.env.PUBLIC_ENV__AUTH__AUTHORITY_SIGNOUT_URI ??
    'http://localhost:9000/if/flow/dreammallearth-invalidation-flow/') as string,
  CLIENT_ID: (import.meta.env.PUBLIC_ENV__AUTH__CLIENT_ID ??
    'G3g0sjCjph1NAyGeeu5Te5ltx1I7WZ0DGB8i6vOI') as string,
  REDIRECT_URI: (import.meta.env.PUBLIC_ENV__AUTH__REDIRECT_URI ??
    'http://localhost:3001/auth') as string,
  SILENT_REDIRECT_URI: (import.meta.env.PUBLIC_ENV__AUTH__SILENT_REDIRECT_URI ??
    'http://localhost:3001/silent-refresh') as string,
  RESPONSE_TYPE: (import.meta.env.PUBLIC_ENV__AUTH__RESPONSE_TYPE ?? 'code') as string,
  SCOPE: (import.meta.env.PUBLIC_ENV__AUTH__SCOPE ?? 'openid profile posts') as string,
  UNAUTHORIZED_REDIRECT_URI: (import.meta.env.PUBLIC_ENV__AUTH__UNAUTHORIZED_REDIRECT_URI ??
    'http://localhost:3001/') as string,
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
