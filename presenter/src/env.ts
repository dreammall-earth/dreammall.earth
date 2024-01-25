const ENDPOINTS = {
  GRAPHQL_URI: (import.meta.env.PUBLIC_ENV__ENDPOINTS__GRAPHQL_URI ??
    'http://localhost:4000/') as string,
}

const META = {
  BASE_URL: (import.meta.env.PUBLIC_ENV__META__BASE_URL ?? 'http://localhost:3000') as string,
  DEFAULT_AUTHOR: (import.meta.env.PUBLIC_ENV__META__DEFAULT_AUTHOR ?? 'DreamMall Verlag GbR') as string,
  DEFAULT_DESCRIPTION: (import.meta.env.PUBLIC_ENV__META__DEFAULT_DESCRIPTION ??
    'Deine Reichweite Erweitern Alle Möglichkeiten Miteinander Ausschöpfen Lebensqualität Leben') as string,
  DEFAULT_TITLE: (import.meta.env.PUBLIC_ENV__META__DEFAULT_TITLE ?? 'DreamMall') as string,
}

export { ENDPOINTS, META }
