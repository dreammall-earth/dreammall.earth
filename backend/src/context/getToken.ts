export const getToken = (authorization: string | undefined): string | undefined => {
  return authorization ? authorization.replace(/^[Bb]earer */, '') : undefined
}
