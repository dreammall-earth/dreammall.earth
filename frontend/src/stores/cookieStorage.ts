import jsCookie from 'js-cookie'

import type { Request, Response } from 'express'

class ExpressCookie {
  req: Request
  res: Response<unknown, Record<string, unknown>>

  constructor(req: Request, res: Response) {
    this.req = req
    this.res = res
  }

  set(name: string, value: string, options: object) {
    this.res.cookie(name, value, options)
  }

  get(name: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, security/detect-object-injection, @typescript-eslint/no-unsafe-member-access
    return this.req.cookies[name]
  }

  remove(name: string) {
    this.res.clearCookie(name)
  }
}

class CookieStorage {
  cookie: ExpressCookie | typeof jsCookie

  constructor(req: Request | null = null, res: Response | null = null) {
    const isServer = req && res
    if (isServer) {
      this.cookie = new ExpressCookie(req, res)
    } else {
      this.cookie = jsCookie
    }
  }

  setItem(key: string, state: string) {
    this.cookie.set(key, state, {
      expires: 3,
      Secure: true,
      SameSite: 'Strict',
    })
  }

  getItem(key: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.cookie.get(key) || null
  }

  removeItem(key: string) {
    this.cookie.remove(key)
  }

  static create = (req: Request, res: Response) => new CookieStorage(req, res)
}

export const cookieStorage = new CookieStorage()
