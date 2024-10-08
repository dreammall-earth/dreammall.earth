// This file isn't processed by Vite, see https://github.com/vikejs/vike/issues/562
// Consequently:
//  - When changing this file, you needed to manually restart your server for your changes to take effect.
//  - To use your environment variables defined in your .env files, you need to install dotenv, see https://vike.dev/env
//  - To use your path aliases defined in your vite.config.js, you need to tell Node.js about them, see https://vike.dev/path-aliases

// If you want Vite to process your server code then use one of these:
//  - vavite (https://github.com/cyco130/vavite)
//     - See vavite + Vike examples at https://github.com/cyco130/vavite/tree/main/examples
//  - vite-node (https://github.com/antfu/vite-node)
//  - HatTip (https://github.com/hattipjs/hattip)
//    - You can use Bati (https://batijs.github.io/) to scaffold a Vike + HatTip app. Note that Bati generates apps that use the V1 design (https://vike.dev/migration/v1-design) and Vike packages (https://vike.dev/vike-packages)

import compression from 'compression'
import express from 'express'
import { renderPage } from 'vike/server'

import { publicEnv } from './config'
import { root } from './root'

const isProduction = process.env.NODE_ENV === 'production'

void startServer()

async function startServer() {
  const app = express()

  // Vite integration
  if (isProduction) {
    // In production, we need to serve our static assets ourselves.
    // (In dev, Vite's middleware serves our static assets.)
    const sirv = (await import('sirv')).default
    // assets 1y caching
    app.use(
      '/assets',
      sirv(`${root}/build/client/assets`, {
        maxAge: 31536000, // 1Y
        immutable: true,
        gzip: true,
      }),
    )
    // cache things for 10min
    app.use(
      sirv(`${root}/build/client`, {
        maxAge: 600,
        immutable: true,
        gzip: true,
      }),
    )
  } else {
    // We instantiate Vite's development server and integrate its middleware to our server.
    // ⚠️ We instantiate it only in development. (It isn't needed in production and it
    // would unnecessarily bloat our production server.)
    const vite = await import('vite')
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: true },
      })
    ).middlewares
    app.use(viteDevMiddleware)

    // on the fly compression
    app.use(compression())
  }

  // ...
  // Other middlewares (e.g. some RPC middleware such as Telefunc)
  // ...

  // Vike middleware. It should always be our last middleware (because it's a
  // catch-all middleware superseding any middleware placed after it).
  app.get('*', (req, res, next) => {
    void (async (req, res, next) => {
      const pageContextInit = {
        urlOriginal: req.originalUrl,
        publicEnv,
      }
      const pageContext = await renderPage(pageContextInit)
      const { httpResponse } = pageContext
      if (!httpResponse) {
        next()
      } else {
        const { body, statusCode, headers, earlyHints } = httpResponse
        if (process.env.EARLY_HINTS && res.writeEarlyHints)
          res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) })
        headers.forEach(([name, value]) => res.setHeader(name, value))
        res.status(statusCode)
        // For HTTP streams use httpResponse.pipe() instead, see https://vike.dev/stream
        res.send(body)
      }
    })(req, res, next)
  })

  const port = process.env.PORT || 3000
  app.listen(port)
  // eslint-disable-next-line no-console
  console.log(`🚀 Server running at http://localhost:${port}`)
}
