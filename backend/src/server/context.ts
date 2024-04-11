export type Context = {
  token?: string
}

export type GetContextToken = (authorization: string | undefined) => string | undefined

export const getContextToken: GetContextToken = (authorization) => {
  return authorization ? authorization.replace(/^[Bb]earer */, '') : undefined
}
