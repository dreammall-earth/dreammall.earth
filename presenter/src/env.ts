const ENDPOINTS = {
  GRAPHQL_URI: (import.meta.env.PUBLIC_ENV__ENDPOINTS__GRAPHQL_URI ??
    'http://localhost:4000/') as string,
}

const META = {
  DEFAULT_TITLE: (import.meta.env.PUBLIC_ENV__META__DEFAULT_TITLE ?? 'DreamMall') as string,
  DEFAULT_DESCRIPTION: (import.meta.env.PUBLIC_ENV__META__DEFAULT_DESCRIPTION ??
    'DreamMall Client') as string,
}

export { ENDPOINTS, META }
