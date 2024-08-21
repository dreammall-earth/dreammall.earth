/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const importMetaUrl =
  typeof document === 'undefined'
    ? // eslint-disable-next-line @typescript-eslint/no-require-imports
      (new (require('url').URL)('file:' + __filename) as URL).href
    : (document.currentScript && (document.currentScript as any).src) ||
      new URL('main.js', document.baseURI).href
