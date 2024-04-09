export type Context = {
  token?: string
}

export type GetConextToken = (authorization: string | undefined) => string | undefined

export const getContextToken: GetConextToken = (authorization) => {
  return authorization ? authorization.replace(/^[Bb]earer */, '') : undefined
}
