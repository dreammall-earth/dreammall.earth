const AUTH = {
  AUTHORITY: (import.meta.env.PUBLIC_ENV__AUTH__AUTHORITY ?? 'http://localhost:9000') as string,
  AUTHORITY_SIGNUP_URI: (import.meta.env.PUBLIC_ENV__AUTH__AUTHORITY_SIGNUP_URI ??
    'http://localhost:9000/signup') as string,
  CLIENT_ID: (import.meta.env.PUBLIC_ENV__AUTH__CLIENT_ID ?? 'dreammall-presenter') as string,
  REDIRECT_URI: (import.meta.env.PUBLIC_ENV__AUTH__REDIRECT_URI ??
    'http://localhost:3000/auth') as string,
  SILENT_REDIRECT_URI: (import.meta.env.PUBLIC_ENV__AUTH__SILENT_REDIRECT_URI ??
    'http://localhost:3000/silent-refresh') as string,
  POST_LOGOUT_REDIRECT_URI: (import.meta.env.PUBLIC_ENV__AUTH__POST_LOGOUT_REDIRECT_URI ??
    'http://localhost:3000') as string,
  RESPONSE_TYPE: (import.meta.env.PUBLIC_ENV__AUTH__RESPONSE_TYPE ?? 'code') as string,
  SCOPE: (import.meta.env.PUBLIC_ENV__AUTH__SCOPE ?? 'openid profile posts') as string,
}

const ENDPOINTS = {
  GRAPHQL_URI: (import.meta.env.PUBLIC_ENV__ENDPOINTS__GRAPHQL_URI ??
    'http://localhost:4000/') as string,
}

const META = {
  BASE_URL: (import.meta.env.PUBLIC_ENV__META__BASE_URL ?? 'http://localhost:3000') as string,
  DEFAULT_AUTHOR: (import.meta.env.PUBLIC_ENV__META__DEFAULT_AUTHOR ??
    'DreamMall Verlag GbR') as string,
  DEFAULT_DESCRIPTION: (import.meta.env.PUBLIC_ENV__META__DEFAULT_DESCRIPTION ??
    'Deine Reichweite Erweitern Alle Möglichkeiten Miteinander Ausschöpfen Lebensqualität Leben') as string,
  DEFAULT_TITLE: (import.meta.env.PUBLIC_ENV__META__DEFAULT_TITLE ?? 'DreamMall') as string,
}

export { AUTH, ENDPOINTS, META }
