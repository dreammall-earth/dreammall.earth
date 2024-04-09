export type Context = {
  token?: string
}

export type GetConextToken = (authorization: string | undefined) => string | undefined

export const getContextToken = (authorization: string | undefined): string | undefined => {
  return authorization ? authorization.replace(/^[Bb]earer */, '') : undefined
}
